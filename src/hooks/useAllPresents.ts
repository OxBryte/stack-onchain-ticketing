import { useState, useEffect, useCallback } from "react";
import { ContractService } from "../services/contract.service";

interface Present {
  id: number;
  info: {
    creator: { value: string };
    title: { value: string };
    amount: { value: string };
    "password-hash": { value: string };
    claimed: { value: boolean };
    claimer: { value: string };
    "created-at": { value: string };
  };
}

/**
 * Hook for fetching all Christmas presents
 */
export function useAllPresents() {
  const [presents, setPresents] = useState<Present[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPresents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await ContractService.getAllPresents(0);
      // Filter out null values and map to our format
      const validPresents = result
        .filter((p): p is { id: number; info: any } => p !== null)
        .map((p) => ({
          id: p.id,
          info: p.info,
        }));
      setPresents(validPresents);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setPresents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPresents();
  }, [fetchPresents]);

  return { presents, isLoading, error, refetch: fetchPresents };
}

