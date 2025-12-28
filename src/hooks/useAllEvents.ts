import { useState, useEffect, useCallback } from "react";
import { ContractService } from "../services/contract.service";
import type { EventInfo } from "../types/contract";

export interface EventWithId {
  id: number;
  info: EventInfo | null;
}

/**
 * Hook for fetching all events
 */
export function useAllEvents() {
  const [events, setEvents] = useState<EventWithId[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAllEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allEvents = await ContractService.getAllEvents();

      // Parse and format events
      const formattedEvents: EventWithId[] = allEvents.map((event) => {
        if (!event.info) {
          return { id: event.id, info: null };
        }

        const info = event.info;
        return {
          id: event.id,
          info: {
            name: info.name?.value || "",
            description: info.description?.value || "",
            venue: info.venue?.value || "",
            date: BigInt(info.date?.value || 0),
            price: BigInt(info.price?.value || 0),
            "total-tickets": BigInt(info["total-tickets"]?.value || 0),
            "sold-tickets": BigInt(info["sold-tickets"]?.value || 0),
            active: info.active?.value || false,
          },
        };
      });

      // Filter out null events and sort by date (newest first)
      const validEvents = formattedEvents.filter((e) => e.info !== null);
      validEvents.sort((a, b) => {
        if (!a.info || !b.info) return 0;
        return Number(b.info.date) - Number(a.info.date);
      });

      setEvents(validEvents);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  return { events, isLoading, error, refetch: fetchAllEvents };
}
