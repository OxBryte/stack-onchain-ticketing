import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Landing() {
  const { connectWallet, isConnected } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      navigate("/dashboard");
    }
  }, [isConnected, navigate]);

  const handleConnect = async () => {
    await connectWallet();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Welcome to{" "}
          <span className="text-indigo-600">TicketChain</span>
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          Your decentralized ticketing platform on Stacks
        </p>
        <p className="text-lg text-gray-500 mb-12">
          Buy, sell, and manage event tickets securely on the blockchain
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleConnect}
            className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl"
          >
            Connect Wallet to Get Started
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">Secure</h3>
            <p className="text-gray-600">
              All tickets are stored on-chain, ensuring authenticity and
              preventing fraud
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Fast</h3>
            <p className="text-gray-600">
              Instant ticket transfers and verifications powered by Stacks
              blockchain
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-semibold mb-2">Decentralized</h3>
            <p className="text-gray-600">
              No intermediaries. You own and control your tickets completely
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

