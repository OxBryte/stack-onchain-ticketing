import { openContractCall } from "@stacks/connect";
import {
  uintCV,
  stringAsciiCV,
  principalCV,
  someCV,
  noneCV,
} from "@stacks/transactions";
import {
  CONTRACT_CONFIG,
  CHRISTMAS_PRESENTS_CONFIG,
} from "../constants/contract";
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
      const apiBase =
        network === "testnet"
          ? "https://api.testnet.hiro.so"
          : "https://api.hiro.so";

      // API format: /v2/contracts/call-read/{stx_address}/{contract_name}/{function_name}
      const apiUrl = `${apiBase}/v2/contracts/call-read/${CONTRACT_CONFIG.contractAddress}/${CONTRACT_CONFIG.contractName}/${functionName}`;

      // Convert ClarityValue to API format
      const args = functionArgs.map((arg) => clarityValueToApiFormat(arg));

      const requestBody: {
        sender: string;
        arguments: any[];
      } = {
        sender: CONTRACT_CONFIG.contractAddress,
        arguments: args,
      };

      console.log("API Call:", {
        url: apiUrl,
        function: functionName,
        args: args,
      });

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error Response (${response.status}):`, errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as T;
      return data as T;
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.error(
          `Network error calling ${functionName}. This could be due to:`,
          "\n1. CORS issues (if running locally)",
          "\n2. Network connectivity",
          "\n3. Incorrect API endpoint",
          "\n4. Contract not deployed or incorrect address"
        );
        throw new Error(
          `Failed to fetch: ${functionName}. Check console for details.`
        );
      }
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
   * Get latest events (read-only)
   * Returns up to 10 most recent events using the new contract function
   */
  static async getLatestEvents(
    startFrom: number = 0
  ): Promise<Array<{ id: number; info: any } | null>> {
    try {
      const result = await this.readOnlyCall<{
        value: Array<any>;
      }>("get-latest-events", [uintCV(startFrom)]);

      if (!result?.value) {
        return [];
      }

      // Parse the response - it returns a list of optional events
      const events: Array<{ id: number; info: any } | null> = [];
      const totalEvents = await this.getTotalEvents();
      const startId =
        startFrom === 0 ? (totalEvents >= 10 ? totalEvents - 9 : 1) : startFrom;

      result.value.forEach((eventOption: any, index: number) => {
        if (eventOption && eventOption.value) {
          const eventId = startId + index;
          events.push({
            id: eventId,
            info: eventOption.value,
          });
        } else {
          events.push(null);
        }
      });

      return events.filter((e) => e !== null) as Array<{
        id: number;
        info: any;
      }>;
    } catch (error) {
      console.error("Error fetching latest events:", error);
      // Fallback to old method if new function fails
      return this.getAllEvents();
    }
  }

  /**
   * Get all events (read-only)
   * Fetches events by iterating through event IDs
   * This is a fallback method if get-latest-events is not available
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

  /**
   * Make a contract call for Christmas presents contract
   * Note: For create-present, the user must transfer STX to the contract address
   * before calling this function. The STX transfer should be done as a separate
   * transaction or using postConditions (implementation depends on @stacks/connect version)
   */
  private static async callChristmasPresentsContract(
    functionName: string,
    functionArgs: any[]
  ): Promise<void> {
    try {
      await openContractCall({
        contractAddress: CHRISTMAS_PRESENTS_CONFIG.contractAddress,
        contractName: CHRISTMAS_PRESENTS_CONFIG.contractName,
        functionName,
        functionArgs,
        network: CHRISTMAS_PRESENTS_CONFIG.network as any,
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
   * Read-only contract call for Christmas presents using Stacks API
   */
  private static async readOnlyCallChristmasPresents<T>(
    functionName: string,
    functionArgs: any[]
  ): Promise<T> {
    try {
      const network =
        CHRISTMAS_PRESENTS_CONFIG.network === "testnet"
          ? "testnet"
          : "mainnet";

      const apiBase =
        network === "testnet"
          ? "https://api.testnet.hiro.so"
          : "https://api.hiro.so";

      const apiUrl = `${apiBase}/v2/contracts/call-read/${CHRISTMAS_PRESENTS_CONFIG.contractAddress}/${CHRISTMAS_PRESENTS_CONFIG.contractName}/${functionName}`;

      const args = functionArgs.map((arg) => clarityValueToApiFormat(arg));

      const requestBody: {
        sender: string;
        arguments: any[];
      } = {
        sender: CHRISTMAS_PRESENTS_CONFIG.contractAddress,
        arguments: args,
      };

      console.log("API Call:", {
        url: apiUrl,
        function: functionName,
        args: args,
      });

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error Response (${response.status}):`, errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as T;
      return data as T;
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        console.error(
          `Network error calling ${functionName}. This could be due to:`,
          "\n1. CORS issues (if running locally)",
          "\n2. Network connectivity",
          "\n3. Incorrect API endpoint",
          "\n4. Contract not deployed or incorrect address"
        );
        throw new Error(
          `Failed to fetch: ${functionName}. Check console for details.`
        );
      }
      console.error(`Error in read-only call ${functionName}:`, error);
      throw error;
    }
  }

  // ========== Christmas Presents Methods ==========

  /**
   * Create a Christmas present with STX amount, title, and password
   */
  static async createPresent(params: {
    title: string;
    amount: number; // Amount in micro-STX
    password: string;
  }): Promise<void> {
    await this.callChristmasPresentsContract(
      "create-present",
      [
        stringAsciiCV(params.title),
        uintCV(params.amount),
        stringAsciiCV(params.password),
      ],
      params.amount // Transfer STX as part of the transaction
    );
  }

  /**
   * Claim a present using the password
   */
  static async claimPresent(
    presentId: number,
    password: string
  ): Promise<void> {
    await this.callChristmasPresentsContract("claim-present", [
      uintCV(presentId),
      stringAsciiCV(password),
    ]);
  }

  /**
   * Withdraw STX for a claimed present
   */
  static async withdrawPresent(presentId: number): Promise<void> {
    await this.callChristmasPresentsContract("withdraw-present", [
      uintCV(presentId),
    ]);
  }

  /**
   * Get present by ID (read-only)
   */
  static async getPresentById(presentId: number): Promise<any> {
    return this.readOnlyCallChristmasPresents("get-present-by-id", [
      uintCV(presentId),
    ]);
  }

  /**
   * Get all presents (read-only)
   * Returns up to 10 most recent presents
   */
  static async getAllPresents(
    startFrom: number = 0
  ): Promise<Array<{ id: number; info: any } | null>> {
    try {
      const result = await this.readOnlyCallChristmasPresents<{
        value: Array<any>;
      }>("get-all-presents", [uintCV(startFrom)]);

      if (!result?.value) {
        return [];
      }

      // Parse the response - it returns a list of optional presents
      const presents: Array<{ id: number; info: any } | null> = [];
      const stats = await this.getPresentStats();
      const totalPresents = Number(stats["total-presents"]);
      const startId =
        startFrom === 0
          ? totalPresents >= 10
            ? totalPresents - 9
            : 1
          : startFrom;

      result.value.forEach((presentOption: any, index: number) => {
        if (presentOption && presentOption.value) {
          const presentId = startId + index;
          presents.push({
            id: presentId,
            info: presentOption.value,
          });
        } else {
          presents.push(null);
        }
      });

      return presents.filter((p) => p !== null) as Array<{
        id: number;
        info: any;
      }>;
    } catch (error) {
      console.error("Error fetching all presents:", error);
      throw error;
    }
  }

  /**
   * Get presents by creator (read-only)
   */
  static async getPresentsByCreator(
    creator: string,
    startFrom: number = 0
  ): Promise<Array<{ id: number; info: any } | null>> {
    try {
      const result = await this.readOnlyCallChristmasPresents<{
        value: Array<any>;
      }>("get-presents-by-creator", [principalCV(creator), uintCV(startFrom)]);

      if (!result?.value) {
        return [];
      }

      // Parse similar to getAllPresents
      const presents: Array<{ id: number; info: any } | null> = [];
      const stats = await this.getPresentStats();
      const totalPresents = Number(stats["total-presents"]);
      const startId =
        startFrom === 0
          ? totalPresents >= 10
            ? totalPresents - 9
            : 1
          : startFrom;

      result.value.forEach((presentOption: any, index: number) => {
        if (presentOption && presentOption.value) {
          const presentId = startId + index;
          presents.push({
            id: presentId,
            info: presentOption.value,
          });
        }
      });

      return presents.filter((p) => p !== null) as Array<{
        id: number;
        info: any;
      }>;
    } catch (error) {
      console.error("Error fetching presents by creator:", error);
      throw error;
    }
  }

  /**
   * Get present statistics (read-only)
   */
  static async getPresentStats(): Promise<{ "total-presents": bigint }> {
    const result = await this.readOnlyCallChristmasPresents<{
      value: { "total-presents": string };
    }>("get-stats", []);

    return {
      "total-presents": BigInt(result.value["total-presents"] || "0"),
    };
  }
}
