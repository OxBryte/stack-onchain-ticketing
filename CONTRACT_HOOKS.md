# Contract Hooks Usage Guide

This document explains how to use the contract hooks to interact with the ticketing smart contract.

## Setup

1. Update the contract address in `src/constants/contract.ts` after deploying your contract.

## Available Hooks

### Write Operations (Require Wallet Connection)

#### `useCreateEvent` - Create a new event (admin only)
```typescript
import { useCreateEvent } from '../hooks';

function CreateEventForm() {
  const { createEvent, isLoading, error } = useCreateEvent();

  const handleSubmit = async () => {
    try {
      await createEvent({
        name: "Concert 2024",
        description: "Amazing concert",
        venue: "Madison Square Garden",
        date: Math.floor(Date.now() / 1000) + 86400, // Tomorrow
        price: 1000000, // 1 STX in micro-STX
        totalTickets: 100
      });
      alert("Event created successfully!");
    } catch (err) {
      console.error("Failed to create event:", err);
    }
  };

  return (
    <button onClick={handleSubmit} disabled={isLoading}>
      {isLoading ? "Creating..." : "Create Event"}
    </button>
  );
}
```

#### `useBuyTicket` - Buy tickets for an event
```typescript
import { useBuyTicket } from '../hooks';

function BuyTicketButton({ eventId }: { eventId: number }) {
  const { buyTicket, isLoading, error } = useBuyTicket();

  const handleBuy = async () => {
    try {
      await buyTicket({
        eventId: eventId,
        amount: 2 // Buy 2 tickets
      });
      alert("Tickets purchased successfully!");
    } catch (err) {
      console.error("Failed to buy tickets:", err);
    }
  };

  return (
    <button onClick={handleBuy} disabled={isLoading}>
      {isLoading ? "Processing..." : "Buy Tickets"}
    </button>
  );
}
```

#### `useTransferTicket` - Transfer a ticket to another address
```typescript
import { useTransferTicket } from '../hooks';

function TransferTicketButton({ ticketId, newOwner }: { ticketId: number; newOwner: string }) {
  const { transferTicket, isLoading, error } = useTransferTicket();

  const handleTransfer = async () => {
    try {
      await transferTicket({
        ticketId: ticketId,
        newOwner: newOwner
      });
      alert("Ticket transferred successfully!");
    } catch (err) {
      console.error("Failed to transfer ticket:", err);
    }
  };

  return (
    <button onClick={handleTransfer} disabled={isLoading}>
      {isLoading ? "Transferring..." : "Transfer Ticket"}
    </button>
  );
}
```

#### `useUpdateEvent` - Update event information (admin only)
```typescript
import { useUpdateEvent } from '../hooks';

function UpdateEventForm({ eventId }: { eventId: number }) {
  const { updateEvent, isLoading, error } = useUpdateEvent();

  const handleUpdate = async () => {
    try {
      await updateEvent({
        eventId: eventId,
        price: 2000000, // Update price to 2 STX
        name: "Updated Event Name"
      });
      alert("Event updated successfully!");
    } catch (err) {
      console.error("Failed to update event:", err);
    }
  };

  return (
    <button onClick={handleUpdate} disabled={isLoading}>
      {isLoading ? "Updating..." : "Update Event"}
    </button>
  );
}
```

#### `useCancelEvent` - Cancel an event (admin only)
```typescript
import { useCancelEvent } from '../hooks';

function CancelEventButton({ eventId }: { eventId: number }) {
  const { cancelEvent, isLoading, error } = useCancelEvent();

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this event?")) return;
    
    try {
      await cancelEvent(eventId);
      alert("Event cancelled successfully!");
    } catch (err) {
      console.error("Failed to cancel event:", err);
    }
  };

  return (
    <button onClick={handleCancel} disabled={isLoading}>
      {isLoading ? "Cancelling..." : "Cancel Event"}
    </button>
  );
}
```

### Read Operations (No Wallet Required)

#### `useEventInfo` - Get event information
```typescript
import { useEventInfo } from '../hooks';

function EventDetails({ eventId }: { eventId: number }) {
  const { eventInfo, isLoading, error, refetch } = useEventInfo(eventId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!eventInfo) return <div>Event not found</div>;

  return (
    <div>
      <h2>{eventInfo.name}</h2>
      <p>{eventInfo.description}</p>
      <p>Venue: {eventInfo.venue}</p>
      <p>Price: {Number(eventInfo.price) / 1000000} STX</p>
      <p>Tickets: {Number(eventInfo["sold-tickets"])} / {Number(eventInfo["total-tickets"])}</p>
      <p>Status: {eventInfo.active ? "Active" : "Cancelled"}</p>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

#### `useTicketOwner` - Get ticket owner
```typescript
import { useTicketOwner } from '../hooks';

function TicketOwner({ ticketId }: { ticketId: number }) {
  const { owner, isLoading, error } = useTicketOwner(ticketId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Owner: {owner || "No owner"}</div>;
}
```

#### `useTotalEvents` - Get total number of events
```typescript
import { useTotalEvents } from '../hooks';

function EventStats() {
  const { totalEvents, isLoading, error } = useTotalEvents();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Total Events: {totalEvents}</div>;
}
```

#### `useIsTicketOwner` - Check if user owns a ticket
```typescript
import { useIsTicketOwner } from '../hooks';
import { useAuth } from '../context/AuthContext';

function TicketOwnership({ ticketId }: { ticketId: number }) {
  const { walletInfo } = useAuth();
  const address = walletInfo?.addresses[2]?.address || null;
  const { isOwner, isLoading, error } = useIsTicketOwner(ticketId, address);

  if (isLoading) return <div>Checking...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>You {isOwner ? "own" : "don't own"} this ticket</div>;
}
```

## Error Handling

All hooks return an `error` state that you can use to display error messages:

```typescript
const { buyTicket, isLoading, error } = useBuyTicket();

if (error) {
  // Handle error - show toast, alert, etc.
  console.error("Transaction failed:", error.message);
}
```

## Loading States

All hooks provide `isLoading` state to show loading indicators:

```typescript
const { createEvent, isLoading } = useCreateEvent();

<button disabled={isLoading}>
  {isLoading ? "Processing..." : "Create Event"}
</button>
```

## Notes

- All write operations require the user to have their wallet connected
- Admin functions (create-event, update-event, cancel-event, set-admin) require the caller to be the contract admin
- Prices are in micro-STX (1 STX = 1,000,000 micro-STX)
- Dates should be Unix timestamps (seconds since epoch)
- Ticket amounts for buying are limited to 1-10 tickets per transaction

