/**
 * Contract types based on the Clarity contract
 */

export interface EventInfo {
  name: string;
  description: string;
  venue: string;
  date: bigint;
  price: bigint;
  "total-tickets": bigint;
  "sold-tickets": bigint;
  active: boolean;
}

export interface CreateEventParams {
  name: string;
  description: string;
  venue: string;
  date: number; // Unix timestamp
  price: number; // Price in micro-STX
  totalTickets: number;
}

export interface BuyTicketParams {
  eventId: number;
  amount: number; // 1-10 tickets
}

export interface TransferTicketParams {
  ticketId: number;
  newOwner: string; // Principal address
}

export interface UpdateEventParams {
  eventId: number;
  name?: string;
  description?: string;
  venue?: string;
  price?: number; // Price in micro-STX
}

