import { useState } from "react";
import { connect, disconnect } from "@stacks/connect";
import type { GetAddressesResult } from "@stacks/connect/dist/types/methods";
import "./App.css";

function App() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletInfo, setWalletInfo] = useState<GetAddressesResult | null>(null);
  const [bns, setBns] = useState<string>("");

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
      try {
        const bnsName = await getBns(stxAddress);
        setBns(bnsName);
      } catch {
        // BNS lookup failed, but continue with address
        setBns("");
      }

      setIsConnected(true);
      setWalletInfo(connectionResponse);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  }

  async function disconnectWallet() {
    try {
      disconnect();
      setIsConnected(false);
      setWalletInfo(null);
      setBns("");
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  }

  async function getBns(stxAddress: string): Promise<string> {
    try {
      const response = await fetch(
        `https://api.bnsv2.com/testnet/names/address/${stxAddress}/valid`
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
  console.log(walletInfo, "walletInfo");
  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6 bg-white rounded-xl shadow-lg p-10 w-[400px]">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Stacks Dev Quickstart Message Board
          </h3>
          {isConnected ? (
            <button
              onClick={disconnectWallet}
              className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
            >
              {bns ? bns : walletInfo && walletInfo.addresses[2]?.address}
            </button>
          ) : (
            <button
              onClick={connectWallet}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
