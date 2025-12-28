import { createContext, useContext, ReactNode } from "react";
import { useWallet } from "../hooks/useWallet";
import type { WalletState } from "../types/wallet";

interface AuthContextType extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const wallet = useWallet();

  return (
    <AuthContext.Provider value={wallet}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

