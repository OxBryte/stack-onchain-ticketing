import { useState, useCallback } from "react";
import { ContractService } from "../services/contract.service";
import type { CreatePresentParams, ClaimPresentParams } from "../types/contract";

/**
 * Hook for creating Christmas presents
 */
export function useCreatePresent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPresent = useCallback(
    async (params: CreatePresentParams) => {
      setIsLoading(true);
      setError(null);
      try {
        await ContractService.createPresent(params);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { createPresent, isLoading, error };
}

/**
 * Hook for claiming Christmas presents
 */
export function useClaimPresent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const claimPresent = useCallback(
    async (params: ClaimPresentParams) => {
      setIsLoading(true);
      setError(null);
      try {
        await ContractService.claimPresent(params.presentId, params.password);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { claimPresent, isLoading, error };
}

/**
 * Hook for withdrawing STX from claimed presents
 */
export function useWithdrawPresent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const withdrawPresent = useCallback(async (presentId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await ContractService.withdrawPresent(presentId);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { withdrawPresent, isLoading, error };
}

