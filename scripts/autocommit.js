#!/usr/bin/env node

import { execSync, spawnSync } from 'child_process';
import { existsSync } from 'fs';

// Check if we're in a git repository
if (!existsSync('.git')) {
  console.error('Error: Not a git repository. Please initialize git first.');
  process.exit(1);
}

function hasChanges() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    return status.trim().length > 0;
  } catch (error) {
    return false;
  }
}

function getChangedFiles() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    return status
      .trim()
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => {
        // Extract filename from git status output (format: "XY filename" or "XY old -> new")
        const parts = line.trim().split(/\s+/);
        // Remove the status codes (first 2 characters) and get the filename
        const filename = parts.slice(1).join(' ').split(' -> ').pop();
        return filename;
      })
      .filter(filename => filename); // Remove empty strings
  } catch (error) {
    return [];
  }
}

function commitChanges() {
  try {
    const changedFiles = getChangedFiles();
    
    if (changedFiles.length === 0) {
      console.log('No changes to commit');
      return;
    }

    execSync('git add -A', { stdio: 'inherit' });
    
    // Create commit message with format "changed (filename)" for each file
    // Use multiple -m flags which git will join with newlines
    const commitMessages = changedFiles.map(filename => `changed (${filename})`);
    const commitArgs = ['commit', ...commitMessages.flatMap(msg => ['-m', msg])];
    
    const result = spawnSync('git', commitArgs, { stdio: 'inherit' });
    
    if (result.status === 0) {
      console.log(`✓ Committed: ${changedFiles.length} file(s)`);
    } else {
      throw new Error(`Git commit failed with status ${result.status}`);
    }
  } catch (error) {
    // If commit fails (e.g., no changes to commit), just continue
    if (error.message.includes('nothing to commit') || error.message.includes('status 1')) {
      console.log('No changes to commit');
    } else {
      console.error('Commit error:', error.message);
    }
  }
}

function autocommit() {
  console.log('🚀 Starting autocommit (every 5 seconds)...');
  console.log('Press Ctrl+C to stop\n');

  const interval = setInterval(() => {
    if (hasChanges()) {
      commitChanges();
    } else {
      console.log('No changes detected');
    }
  }, 5000);

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n⏹️  Stopping autocommit...');
    clearInterval(interval);
    process.exit(0);
  });
}

autocommit();

