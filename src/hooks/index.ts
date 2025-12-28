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

// Wallet hook
export { useWallet } from "./useWallet";

