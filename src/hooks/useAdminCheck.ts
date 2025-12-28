import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "./useContractRead";

/**
 * Hook to check if the current user is the contract admin
 */
export function useAdminCheck() {
  const { admin, isLoading: isLoadingAdmin } = useAdmin();
  const { walletInfo } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (admin && walletInfo?.addresses?.[2]?.address) {
      const userAddress = walletInfo.addresses[2].address;
      // Compare addresses (case-insensitive)
      setIsAdmin(
        admin.toLowerCase() === userAddress.toLowerCase()
      );
    } else {
      setIsAdmin(false);
    }
  }, [admin, walletInfo]);

  return { isAdmin, isLoadingAdmin, adminAddress: admin };
}

