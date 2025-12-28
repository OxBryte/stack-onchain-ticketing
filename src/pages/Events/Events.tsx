import { Link } from "react-router-dom";
import { useAllEvents } from "../../hooks/useAllEvents";
import { useAuth } from "../../context/AuthContext";

export function Events() {
  const { events, isLoading, error, refetch } = useAllEvents();
  const { isConnected } = useAuth();

  const formatDate = (timestamp: bigint): string => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: bigint): string => {
    const stx = Number(price) / 1000000;
    return `${stx.toFixed(2)} STX`;
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Error Loading Events
          </h2>
          <p className="text-red-600 mb-4">{error.message}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">All Events</h1>
          <p className="text-gray-600">
            Discover and explore upcoming events on TicketChain
          </p>
        </div>
        {isConnected && (
          <Link
            to="/create-event"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg"
          >
            Create Event
          </Link>
        )}
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">🎫</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No Events Yet
          </h2>
          <p className="text-gray-600 mb-6">Be the first to create an event!</p>
          {isConnected && (
            <Link
              to="/create-event"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Create Your First Event
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            if (!event.info) return null;

            const { info } = event;
            const ticketsRemaining =
              Number(info["total-tickets"]) - Number(info["sold-tickets"]);
            const isSoldOut = ticketsRemaining === 0;
            const isCancelled = !info.active;

            return (
              <div
                key={event.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition transform hover:scale-105 ${
                  isCancelled || isSoldOut ? "opacity-75" : ""
                }`}
              >
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    {isCancelled ? (
                      <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                        Cancelled
                      </span>
                    ) : isSoldOut ? (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                        Sold Out
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Active
                      </span>
                    )}
                    <span className="text-sm text-gray-500">#{event.id}</span>
                  </div>

                  {/* Event Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {info.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {info.description}
                  </p>

                  {/* Venue */}
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="line-clamp-1">{info.venue}</span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{formatDate(info.date)}</span>
                  </div>

                  {/* Price and Tickets */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <p className="text-2xl font-bold text-indigo-600">
                        {formatPrice(info.price)}
                      </p>
                      <p className="text-xs text-gray-500">per ticket</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {ticketsRemaining} / {Number(info["total-tickets"])}
                      </p>
                      <p className="text-xs text-gray-500">tickets left</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/events/${event.id}`}
                    className={`block w-full text-center px-4 py-2 rounded-lg font-semibold transition ${
                      isCancelled || isSoldOut
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                    onClick={(e) => {
                      if (isCancelled || isSoldOut) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {isCancelled
                      ? "Event Cancelled"
                      : isSoldOut
                      ? "Sold Out"
                      : "View Details"}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
