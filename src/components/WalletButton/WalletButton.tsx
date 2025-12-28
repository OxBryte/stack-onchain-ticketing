import { useWallet } from "../../hooks/useWallet";

export function WalletButton() {
  const { isConnected, bns, walletInfo, connectWallet, disconnectWallet } =
    useWallet();

  const displayAddress = bns || walletInfo?.addresses[2]?.address || "";

  return (
    <div className="flex flex-col items-center space-y-6 bg-white rounded-xl shadow-lg p-10 w-[400px]">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Stacks Dev Quickstart Message Board
      </h3>
      {isConnected ? (
        <button
          onClick={disconnectWallet}
          className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
        >
          {displayAddress}
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
  );
}

