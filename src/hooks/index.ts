// Contract interaction hooks
export {
  useCreateEvent,
  useBuyTicket,
  useTransferTicket,
  useUpdateEvent,
  useCancelEvent,
  useSetAdmin,
} from "./useContract";

// Read-only contract hooks
export {
  useEventInfo,
  useTicketOwner,
  useTicketEvent,
  useIsTicketOwner,
  useTotalEvents,
  useTotalTickets,
  useAdmin,
} from "./useContractRead";

// All events hook
export { useAllEvents } from "./useAllEvents";
export type { EventWithId } from "./useAllEvents";

// Admin check hook
export { useAdminCheck } from "./useAdminCheck";

// Wallet hook
export { useWallet } from "./useWallet";
