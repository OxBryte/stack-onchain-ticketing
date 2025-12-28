import type { GetAddressesResult } from "@stacks/connect/dist/types/methods";

export type { GetAddressesResult };

export interface WalletState {
  isConnected: boolean;
  walletInfo: GetAddressesResult | null;
  bns: string;
}

