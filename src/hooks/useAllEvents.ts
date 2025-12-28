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
      // Try to use the new get-latest-events function first
      // If it fails, fallback to getAllEvents
      let allEvents;
      try {
        allEvents = await ContractService.getLatestEvents(0);
      } catch (latestError) {
        console.log("Falling back to getAllEvents:", latestError);
        allEvents = await ContractService.getAllEvents();
      }

      // Parse and format events
      const formattedEvents: EventWithId[] = allEvents
        .filter((event) => event !== null && event.info !== null)
        .map((event) => {
          if (!event || !event.info) {
            return { id: 0, info: null };
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
