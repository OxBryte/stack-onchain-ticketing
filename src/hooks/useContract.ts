import { useState, useCallback } from "react";
import { ContractService } from "../services/contract.service";
import type {
  CreateEventParams,
  BuyTicketParams,
  TransferTicketParams,
  UpdateEventParams,
} from "../types/contract";

/**
 * Base hook for contract interactions with loading and error states
 */
export function useContractCall() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (fn: () => Promise<void>) => {
    setIsLoading(true);
    setError(null);
    try {
      await fn();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, error, execute };
}

/**
 * Hook for creating events (admin only)
 */
export function useCreateEvent() {
  const { isLoading, error, execute } = useContractCall();

  const createEvent = useCallback(
    async (params: CreateEventParams) => {
      await execute(() => ContractService.createEvent(params));
    },
    [execute]
  );

  return { createEvent, isLoading, error };
}

/**
 * Hook for buying tickets
 */
export function useBuyTicket() {
  const { isLoading, error, execute } = useContractCall();

  const buyTicket = useCallback(
    async (params: BuyTicketParams) => {
      await execute(() =>
        ContractService.buyTicket(params.eventId, params.amount)
      );
    },
    [execute]
  );

  return { buyTicket, isLoading, error };
}

/**
 * Hook for transferring tickets
 */
export function useTransferTicket() {
  const { isLoading, error, execute } = useContractCall();

  const transferTicket = useCallback(
    async (params: TransferTicketParams) => {
      await execute(() =>
        ContractService.transferTicket(params.ticketId, params.newOwner)
      );
    },
    [execute]
  );

  return { transferTicket, isLoading, error };
}

/**
 * Hook for updating events (admin only)
 */
export function useUpdateEvent() {
  const { isLoading, error, execute } = useContractCall();

  const updateEvent = useCallback(
    async (params: UpdateEventParams) => {
      await execute(() => ContractService.updateEvent(params));
    },
    [execute]
  );

  return { updateEvent, isLoading, error };
}

/**
 * Hook for canceling events (admin only)
 */
export function useCancelEvent() {
  const { isLoading, error, execute } = useContractCall();

  const cancelEvent = useCallback(
    async (eventId: number) => {
      await execute(() => ContractService.cancelEvent(eventId));
    },
    [execute]
  );

  return { cancelEvent, isLoading, error };
}

/**
 * Hook for setting admin (admin only)
 */
export function useSetAdmin() {
  const { isLoading, error, execute } = useContractCall();

  const setAdmin = useCallback(
    async (newAdmin: string) => {
      await execute(() => ContractService.setAdmin(newAdmin));
    },
    [execute]
  );

  return { setAdmin, isLoading, error };
}

