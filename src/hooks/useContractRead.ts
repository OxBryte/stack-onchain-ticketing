import { useState, useEffect, useCallback } from "react";
import { ContractService } from "../services/contract.service";
import type { EventInfo } from "../types/contract";

/**
 * Hook for reading event information
 */
export function useEventInfo(eventId: number | null) {
  const [eventInfo, setEventInfo] = useState<EventInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEventInfo = useCallback(async () => {
    if (eventId === null) {
      setEventInfo(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await ContractService.getEventInfo(eventId);
      if (result && result.value) {
        // Parse the Clarity value response
        const event = result.value;
        setEventInfo({
          name: event.name?.value || "",
          description: event.description?.value || "",
          venue: event.venue?.value || "",
          date: BigInt(event.date?.value || 0),
          price: BigInt(event.price?.value || 0),
          "total-tickets": BigInt(event["total-tickets"]?.value || 0),
          "sold-tickets": BigInt(event["sold-tickets"]?.value || 0),
          active: event.active?.value || false,
        });
      } else {
        setEventInfo(null);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setEventInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchEventInfo();
  }, [fetchEventInfo]);

  return { eventInfo, isLoading, error, refetch: fetchEventInfo };
}

/**
 * Hook for reading ticket owner
 */
export function useTicketOwner(ticketId: number | null) {
  const [owner, setOwner] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchOwner = useCallback(async () => {
    if (ticketId === null) {
      setOwner(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await ContractService.getTicketOwner(ticketId);
      setOwner(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setOwner(null);
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchOwner();
  }, [fetchOwner]);

  return { owner, isLoading, error, refetch: fetchOwner };
}

/**
 * Hook for reading ticket event
 */
export function useTicketEvent(ticketId: number | null) {
  const [eventId, setEventId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvent = useCallback(async () => {
    if (ticketId === null) {
      setEventId(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await ContractService.getTicketEvent(ticketId);
      setEventId(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setEventId(null);
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return { eventId, isLoading, error, refetch: fetchEvent };
}

/**
 * Hook for checking if user owns a ticket
 */
export function useIsTicketOwner(ticketId: number | null, owner: string | null) {
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const checkOwnership = useCallback(async () => {
    if (ticketId === null || owner === null) {
      setIsOwner(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await ContractService.isTicketOwner(ticketId, owner);
      setIsOwner(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setIsOwner(false);
    } finally {
      setIsLoading(false);
    }
  }, [ticketId, owner]);

  useEffect(() => {
    checkOwnership();
  }, [checkOwnership]);

  return { isOwner, isLoading, error, refetch: checkOwnership };
}

/**
 * Hook for getting total events count
 */
export function useTotalEvents() {
  const [totalEvents, setTotalEvents] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTotalEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await ContractService.getTotalEvents();
      setTotalEvents(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTotalEvents();
  }, [fetchTotalEvents]);

  return { totalEvents, isLoading, error, refetch: fetchTotalEvents };
}

/**
 * Hook for getting total tickets count
 */
export function useTotalTickets() {
  const [totalTickets, setTotalTickets] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTotalTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await ContractService.getTotalTickets();
      setTotalTickets(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTotalTickets();
  }, [fetchTotalTickets]);

  return { totalTickets, isLoading, error, refetch: fetchTotalTickets };
}

/**
 * Hook for getting admin address
 */
export function useAdmin() {
  const [admin, setAdmin] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAdmin = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await ContractService.getAdmin();
      setAdmin(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmin();
  }, [fetchAdmin]);

  return { admin, isLoading, error, refetch: fetchAdmin };
}

