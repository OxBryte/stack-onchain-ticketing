import { useState } from "react";
import { connect, disconnect } from "@stacks/connect";
import type { GetAddressesResult } from "@stacks/connect/dist/types/methods";
import { BnsService } from "../services/bns.service";
import type { WalletState } from "../types/wallet";

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    walletInfo: null,
    bns: "",
  });

  async function connectWallet() {
    try {
      const connectionResponse: GetAddressesResult = await connect();

      // Check if addresses array exists and has at least 3 elements
      if (
        !connectionResponse?.addresses ||
        connectionResponse.addresses.length < 3
      ) {
        throw new Error("Invalid wallet connection response");
      }

      const stxAddress = connectionResponse.addresses[2].address;

      // Try to get BNS name, but don't fail if it doesn't exist
      let bnsName = "";
      try {
        bnsName = await BnsService.getBnsName(stxAddress);
      } catch {
        // BNS lookup failed, but continue with address
        bnsName = "";
      }

      setWalletState({
        isConnected: true,
        walletInfo: connectionResponse,
        bns: bnsName,
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  }

  async function disconnectWallet() {
    try {
      disconnect();
      setWalletState({
        isConnected: false,
        walletInfo: null,
        bns: "",
      });
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  }

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
  };
}

