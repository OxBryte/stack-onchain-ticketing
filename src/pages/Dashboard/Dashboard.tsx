import { useAuth } from "../../context/AuthContext";
import { truncateAddress } from "../../utils/address";

export function Dashboard() {
  const { bns, walletInfo } = useAuth();
  const address = walletInfo?.addresses[2]?.address || "";

  // Mock data - in a real app, this would come from API/blockchain
  const stats = {
    ticketsOwned: 5,
    eventsAttended: 12,
    totalSpent: 1250,
    activeEvents: 3,
  };

  const recentTickets = [
    {
      id: 1,
      eventName: "Stacks Conference 2024",
      date: "2024-03-15",
      type: "VIP",
      status: "Active",
    },
    {
      id: 2,
      eventName: "Blockchain Music Festival",
      date: "2024-03-20",
      type: "General",
      status: "Active",
    },
    {
      id: 3,
      eventName: "Web3 Developer Meetup",
      date: "2024-02-28",
      type: "Early Bird",
      status: "Used",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      name: "Stacks Conference 2024",
      date: "March 15, 2024",
      location: "San Francisco, CA",
      tickets: 2,
    },
    {
      id: 2,
      name: "Blockchain Music Festival",
      date: "March 20, 2024",
      location: "Austin, TX",
      tickets: 1,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome back!
        </h1>
        <p className="text-lg text-gray-600">
          {bns || truncateAddress(address)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Tickets Owned</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.ticketsOwned}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h3a2 2 0 002-2V7a2 2 0 00-2-2H5zM5 13a2 2 0 00-2 2v3a2 2 0 002 2h3a2 2 0 002-2v-3a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h3a2 2 0 012 2v3a2 2 0 01-2 2h-3a2 2 0 01-2-2v-3z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Events Attended</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.eventsAttended}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalSpent} STX
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Events</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.activeEvents}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
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
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tickets */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Tickets</h2>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {ticket.eventName}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{ticket.date}</span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {ticket.type}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        ticket.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </div>
                <button className="ml-4 text-indigo-600 hover:text-indigo-800">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Upcoming Events
            </h2>
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              Browse All
            </button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition"
              >
                <h3 className="font-semibold text-gray-900 mb-2">
                  {event.name}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                  <svg
                    className="w-4 h-4"
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
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                  <svg
                    className="w-4 h-4"
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
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {event.tickets} ticket{event.tickets > 1 ? "s" : ""} owned
                  </span>
                  <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition text-left">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Browse Events</p>
              <p className="text-sm text-gray-600">Discover new events</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition text-left">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Create Event</p>
              <p className="text-sm text-gray-600">Host your own event</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition text-left">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">My Tickets</p>
              <p className="text-sm text-gray-600">View all tickets</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
