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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="flex items-center justify-center min-h-[80vh] px-4 py-20">
        <div className="max-w-6xl w-full text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="text-indigo-600">TicketChain</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 mb-4">
            Your decentralized ticketing platform on Stacks
          </p>
          <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto">
            Buy, sell, and manage event tickets securely on the blockchain.
            Experience the future of event ticketing with complete transparency
            and ownership.
          </p>

          {!isConnected && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={handleConnect}
                className="px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Connect Wallet to Get Started
              </button>
            </div>
          )}

          {/* Features Grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🔒</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                Secure
              </h3>
              <p className="text-gray-600">
                All tickets are stored on-chain, ensuring authenticity and
                preventing fraud. Your tickets are cryptographically secured.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                Fast
              </h3>
              <p className="text-gray-600">
                Instant ticket transfers and verifications powered by Stacks
                blockchain. No waiting, no delays.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🌐</div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                Decentralized
              </h3>
              <p className="text-gray-600">
                No intermediaries. You own and control your tickets completely.
                True ownership, true freedom.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect Wallet</h3>
              <p className="text-gray-600">
                Connect your Stacks wallet to get started
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Events</h3>
              <p className="text-gray-600">
                Discover events and available tickets
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Purchase</h3>
              <p className="text-gray-600">
                Buy tickets securely with STX tokens
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Own & Transfer</h3>
              <p className="text-gray-600">
                Your tickets are yours to keep or transfer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isConnected && (
        <section className="bg-indigo-600 py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join the future of event ticketing. Connect your wallet and start
              exploring events today.
            </p>
            <button
              onClick={handleConnect}
              className="px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Connect Wallet Now
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
