import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { WalletDropdown } from "./WalletDropdown";

export function Layout() {
  const { isConnected, connectWallet } = useAuth();

  const handleConnect = async () => {
    await connectWallet();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className="text-2xl font-bold text-indigo-600 hover:text-indigo-800"
              >
                TicketChain
              </Link>
              <Link
                to="/events"
                className="text-gray-700 hover:text-indigo-600 transition"
              >
                Events
              </Link>
              {isConnected && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-indigo-600 transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/create-event"
                    className="text-gray-700 hover:text-indigo-600 transition"
                  >
                    Create Event
                  </Link>
                </>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {isConnected ? (
                <WalletDropdown />
              ) : (
                <button
                  onClick={handleConnect}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
}
