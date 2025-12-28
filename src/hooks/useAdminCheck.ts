import { useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "./useContractRead";

/**
 * Hook to check if the current user is the contract admin
 */
export function useAdminCheck() {
  const { admin, isLoading: isLoadingAdmin } = useAdmin();
  const { walletInfo } = useAuth();

  const isAdmin = useMemo(() => {
    if (!admin || !walletInfo?.addresses?.[2]?.address) {
      return false;
    }
    const userAddress = walletInfo.addresses[2].address;
    // Compare addresses (case-insensitive)
    return admin.toLowerCase() === userAddress.toLowerCase();
  }, [admin, walletInfo]);

  return { isAdmin, isLoadingAdmin, adminAddress: admin };
}
