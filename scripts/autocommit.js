#!/usr/bin/env node

import { execSync } from 'child_process';
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

function commitChanges() {
  try {
    const timestamp = new Date().toISOString();
    execSync('git add -A', { stdio: 'inherit' });
    execSync(`git commit -m "Auto-commit: ${timestamp}"`, { stdio: 'inherit' });
    console.log(`✓ Committed at ${timestamp}`);
  } catch (error) {
    // If commit fails (e.g., no changes to commit), just continue
    if (error.message.includes('nothing to commit')) {
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

