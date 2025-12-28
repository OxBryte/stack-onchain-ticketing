import { openContractCall } from "@stacks/connect";
import {
  uintCV,
  stringAsciiCV,
  principalCV,
  boolCV,
  someCV,
  noneCV,
} from "@stacks/transactions";
import { getContractIdentifier, CONTRACT_CONFIG } from "../constants/contract";
import { clarityValueToApiFormat } from "../utils/clarity";

/**
 * Service for interacting with the ticketing contract
 */
export class ContractService {
  /**
   * Make a contract call
   */
  private static async callContract(
    functionName: string,
    functionArgs: any[]
  ): Promise<void> {
    try {
      await openContractCall({
        contractAddress: CONTRACT_CONFIG.contractAddress,
        contractName: CONTRACT_CONFIG.contractName,
        functionName,
        functionArgs,
        network: CONTRACT_CONFIG.network as any,
        onFinish: (data) => {
          console.log("Transaction submitted:", data);
        },
        onCancel: () => {
          console.log("Transaction cancelled");
        },
      });
    } catch (error) {
      console.error(`Error calling ${functionName}:`, error);
      throw error;
    }
  }

  /**
   * Read-only contract call using Stacks API
   */
  static async readOnlyCall<T>(
    functionName: string,
    functionArgs: any[]
  ): Promise<T> {
    try {
      const network =
        CONTRACT_CONFIG.network === "testnet" ? "testnet" : "mainnet";
      
      // Use Hiro API (more reliable than stacks.co)
      const apiBase = network === "testnet" 
        ? "https://api.testnet.hiro.so" 
        : "https://api.hiro.so";
      
      // API format: /v2/contracts/call-read/{stx_address}/{contract_name}/{function_name}
      const apiUrl = `${apiBase}/v2/contracts/call-read/${CONTRACT_CONFIG.contractAddress}/${CONTRACT_CONFIG.contractName}/${functionName}`;

      // Convert ClarityValue to API format
      const args = functionArgs.map((arg) => clarityValueToApiFormat(arg));

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: CONTRACT_CONFIG.contractAddress,
          arguments: args,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as T;
      console.log("Data:", data);
      return data as T;
    } catch (error) {
      console.error(`Error in read-only call ${functionName}:`, error);
      throw error;
    }
  }

  /**
   * Create a new event (admin only)
   */
  static async createEvent(params: {
    name: string;
    description: string;
    venue: string;
    date: number;
    price: number;
    totalTickets: number;
  }): Promise<void> {
    await this.callContract("create-event", [
      stringAsciiCV(params.name),
      stringAsciiCV(params.description),
      stringAsciiCV(params.venue),
      uintCV(params.date),
      uintCV(params.price),
      uintCV(params.totalTickets),
    ]);
  }

  /**
   * Buy tickets for an event
   */
  static async buyTicket(eventId: number, amount: number): Promise<void> {
    await this.callContract("buy-ticket", [uintCV(eventId), uintCV(amount)]);
  }

  /**
   * Transfer a ticket to another principal
   */
  static async transferTicket(
    ticketId: number,
    newOwner: string
  ): Promise<void> {
    await this.callContract("transfer-ticket", [
      uintCV(ticketId),
      principalCV(newOwner),
    ]);
  }

  /**
   * Update event information (admin only)
   */
  static async updateEvent(params: {
    eventId: number;
    name?: string;
    description?: string;
    venue?: string;
    price?: number;
  }): Promise<void> {
    const args: any[] = [uintCV(params.eventId)];

    // Add optional parameters
    args.push(
      params.name ? someCV(stringAsciiCV(params.name)) : noneCV(),
      params.description ? someCV(stringAsciiCV(params.description)) : noneCV(),
      params.venue ? someCV(stringAsciiCV(params.venue)) : noneCV(),
      params.price ? someCV(uintCV(params.price)) : noneCV()
    );

    await this.callContract("update-event", args);
  }

  /**
   * Cancel an event (admin only)
   */
  static async cancelEvent(eventId: number): Promise<void> {
    await this.callContract("cancel-event", [uintCV(eventId)]);
  }

  /**
   * Set a new admin (admin only)
   */
  static async setAdmin(newAdmin: string): Promise<void> {
    await this.callContract("set-admin", [principalCV(newAdmin)]);
  }

  /**
   * Get event information (read-only)
   */
  static async getEventInfo(eventId: number): Promise<any> {
    return this.readOnlyCall("get-event-info", [uintCV(eventId)]);
  }

  /**
   * Get ticket owner (read-only)
   */
  static async getTicketOwner(ticketId: number): Promise<string | null> {
    const result = await this.readOnlyCall<{ value: string }>(
      "get-ticket-owner",
      [uintCV(ticketId)]
    );
    return result?.value || null;
  }

  /**
   * Get event ID for a ticket (read-only)
   */
  static async getTicketEvent(ticketId: number): Promise<number | null> {
    const result = await this.readOnlyCall<{ value: string }>(
      "get-ticket-event",
      [uintCV(ticketId)]
    );
    return result?.value ? parseInt(result.value) : null;
  }

  /**
   * Get current admin (read-only)
   */
  static async getAdmin(): Promise<string> {
    const result = await this.readOnlyCall<{ value: string }>("get-admin", []);
    return result?.value || "";
  }

  /**
   * Get total number of events (read-only)
   */
  static async getTotalEvents(): Promise<number> {
    const result = await this.readOnlyCall<{ value: string }>(
      "get-total-events",
      []
    );
    return result?.value ? parseInt(result.value) : 0;
  }

  /**
   * Get total number of tickets (read-only)
   */
  static async getTotalTickets(): Promise<number> {
    const result = await this.readOnlyCall<{ value: string }>(
      "get-total-tickets",
      []
    );
    return result?.value ? parseInt(result.value) : 0;
  }

  /**
   * Check if a principal owns a specific ticket (read-only)
   */
  static async isTicketOwner(
    ticketId: number,
    owner: string
  ): Promise<boolean> {
    const result = await this.readOnlyCall<{ value: boolean }>(
      "is-ticket-owner",
      [uintCV(ticketId), principalCV(owner)]
    );
    return result?.value || false;
  }

  /**
   * Get all events (read-only)
   * Fetches events by iterating through event IDs
   */
  static async getAllEvents(): Promise<Array<{ id: number; info: any }>> {
    try {
      const totalEvents = await this.getTotalEvents();
      const events: Array<{ id: number; info: any }> = [];

      // Fetch events in parallel
      const promises = [];
      for (let i = 1; i <= totalEvents; i++) {
        promises.push(
          this.getEventInfo(i).then((info) => {
            if (info && info.value) {
              return { id: i, info: info.value };
            }
            return null;
          })
        );
      }

      const results = await Promise.all(promises);
      return results.filter((event) => event !== null) as Array<{
        id: number;
        info: any;
      }>;
    } catch (error) {
      console.error("Error fetching all events:", error);
      throw error;
    }
  }
}
