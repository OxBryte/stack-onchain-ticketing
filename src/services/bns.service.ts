/**
 * BNS (Blockstack Name Service) API service
 */
export class BnsService {
  private static readonly API_BASE_URL = "https://api.bnsv2.com/testnet";

  /**
   * Get BNS name for a given Stacks address
   * @param stxAddress - Stacks address
   * @returns BNS name if found, throws error otherwise
   */
  static async getBnsName(stxAddress: string): Promise<string> {
    try {
      const response = await fetch(
        `${this.API_BASE_URL}/names/address/${stxAddress}/valid`
      );

      if (!response.ok) {
        throw new Error(`BNS API error: ${response.status}`);
      }

      const data = await response.json();

      // Check if names array exists and has at least one element
      if (!data?.names || data.names.length === 0) {
        throw new Error("No BNS name found for this address");
      }

      return data.names[0].full_name;
    } catch (error) {
      console.error("Failed to fetch BNS name:", error);
      throw error;
    }
  }
}

