import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface Present {
  id: number;
  name: string;
  description: string;
  creator: string;
  claimed: boolean;
  claimedBy?: string;
  createdAt: number;
}

export function ChristmasPresents() {
  const { isConnected, connectWallet } = useAuth();
  const [presents, setPresents] = useState<Present[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isClaiming, setIsClaiming] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Present name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreatePresent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      alert("Please connect your wallet to create a present");
      await connectWallet();
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsCreating(true);
    try {
      // TODO: Replace with actual contract call
      // For now, using local state
      const newPresent: Present = {
        id: presents.length + 1,
        name: formData.name.trim(),
        description: formData.description.trim(),
        creator: "current-user", // Would be actual wallet address
        claimed: false,
        createdAt: Date.now(),
      };

      setPresents([...presents, newPresent]);
      setFormData({ name: "", description: "" });
      setShowCreateForm(false);
      alert("Present created successfully! 🎁");
    } catch (error) {
      console.error("Failed to create present:", error);
      alert("Failed to create present. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClaimPresent = async (presentId: number) => {
    if (!isConnected) {
      alert("Please connect your wallet to claim a present");
      await connectWallet();
      return;
    }

    setIsClaiming(presentId);
    try {
      // TODO: Replace with actual contract call
      // For now, using local state
      setPresents(
        presents.map((p) =>
          p.id === presentId
            ? { ...p, claimed: true, claimedBy: "current-user" }
            : p
        )
      );
      alert("Present claimed successfully! 🎉");
    } catch (error) {
      console.error("Failed to claim present:", error);
      alert("Failed to claim present. Please try again.");
    } finally {
      setIsClaiming(null);
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            🎄 Christmas Presents
          </h1>
          <p className="text-gray-600">
            Create and claim Christmas presents on the blockchain
          </p>
        </div>
        <button
          onClick={() => {
            if (!isConnected) {
              connectWallet();
            } else {
              setShowCreateForm(!showCreateForm);
            }
          }}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-lg flex items-center gap-2"
        >
          {!isConnected ? (
            <>
              <span>🔗</span>
              <span>Connect to Create</span>
            </>
          ) : (
            <>
              <span>🎁</span>
              <span>{showCreateForm ? "Cancel" : "Create Present"}</span>
            </>
          )}
        </button>
      </div>

      {/* Create Present Form */}
      {showCreateForm && isConnected && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Create a Christmas Present
          </h2>
          <form onSubmit={handleCreatePresent}>
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Present Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  formErrors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Special Gift for You"
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  formErrors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Describe your Christmas present..."
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ name: "", description: "" });
                  setFormErrors({});
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create Present 🎁"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Wallet Connection Prompt */}
      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🔗</span>
            <div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-1">
                Connect Your Wallet
              </h3>
              <p className="text-yellow-700">
                You can browse presents, but you need to connect your wallet to
                create or claim presents.
              </p>
            </div>
            <button
              onClick={connectWallet}
              className="ml-auto px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
            >
              Connect Wallet
            </button>
          </div>
        </div>
      )}

      {/* Presents Grid */}
      {presents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No Presents Yet
          </h2>
          <p className="text-gray-600 mb-6">
            Be the first to create a Christmas present!
          </p>
          {isConnected ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Create Your First Present
            </button>
          ) : (
            <button
              onClick={connectWallet}
              className="inline-block px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Connect Wallet to Create
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presents.map((present) => (
            <div
              key={present.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition transform hover:scale-105 ${
                present.claimed ? "opacity-75" : ""
              }`}
            >
              <div className="p-6">
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  {present.claimed ? (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                      Claimed
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Available
                    </span>
                  )}
                  <span className="text-sm text-gray-500">#{present.id}</span>
                </div>

                {/* Present Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {present.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {present.description}
                </p>

                {/* Creator */}
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="line-clamp-1">
                    Created by: {present.creator}
                  </span>
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
                  <span>{formatDate(present.createdAt)}</span>
                </div>

                {/* Claimed By */}
                {present.claimed && present.claimedBy && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-semibold">Claimed by:</span>{" "}
                      {present.claimedBy}
                    </p>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleClaimPresent(present.id)}
                  disabled={present.claimed || isClaiming === present.id}
                  className={`block w-full text-center px-4 py-2 rounded-lg font-semibold transition ${
                    present.claimed
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : !isConnected
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {!isConnected
                    ? "Connect Wallet to Claim"
                    : present.claimed
                    ? "Already Claimed"
                    : isClaiming === present.id
                    ? "Claiming..."
                    : "Claim Present 🎁"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

