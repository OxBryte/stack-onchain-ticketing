import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  useAllPresents,
  useCreatePresent,
  useClaimPresent,
  useWithdrawPresent,
} from "../../hooks";

export function ChristmasPresents() {
  const { isConnected, connectWallet, walletInfo } = useAuth();
  const { presents, isLoading: isLoadingPresents, error: presentsError, refetch } = useAllPresents();
  const { createPresent, isLoading: isCreating, error: createError } = useCreatePresent();
  const { claimPresent, isLoading: isClaiming, error: claimError } = useClaimPresent();
  const { withdrawPresent, isLoading: isWithdrawing } = useWithdrawPresent();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [claimingPresentId, setClaimingPresentId] = useState<number | null>(null);
  const [claimPassword, setClaimPassword] = useState("");
  const [withdrawingPresentId, setWithdrawingPresentId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    password: "",
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

    if (!formData.title.trim()) {
      errors.title = "Present title is required";
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      errors.amount = "Amount must be greater than 0 STX";
    }

    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 3) {
      errors.password = "Password must be at least 3 characters";
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

    try {
      // Convert STX to micro-STX
      const amountInMicroStx = Math.floor(parseFloat(formData.amount) * 1000000);

      await createPresent({
        title: formData.title.trim(),
        amount: amountInMicroStx,
        password: formData.password.trim(),
      });

      alert("Present created successfully! 🎁");
      setFormData({ title: "", amount: "", password: "" });
      setShowCreateForm(false);
      // Refetch presents after a short delay to allow transaction to be mined
      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (error) {
      console.error("Failed to create present:", error);
      // Error is already handled by the hook
    }
  };

  const handleClaimPresent = async (presentId: number) => {
    if (!isConnected) {
      alert("Please connect your wallet to claim a present");
      await connectWallet();
      return;
    }

    if (!claimPassword.trim()) {
      alert("Please enter the password to claim this present");
      return;
    }

    try {
      await claimPresent({
        presentId,
        password: claimPassword.trim(),
      });

      alert("Present claimed successfully! 🎉");
      setClaimPassword("");
      setClaimingPresentId(null);
      // Refetch presents after a short delay
      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (error) {
      console.error("Failed to claim present:", error);
      setClaimPassword("");
    }
  };

  const handleWithdrawPresent = async (presentId: number) => {
    if (!isConnected) {
      alert("Please connect your wallet to withdraw STX");
      await connectWallet();
      return;
    }

    try {
      await withdrawPresent(presentId);
      alert("STX withdrawn successfully! 💰");
      setWithdrawingPresentId(null);
      // Refetch presents after a short delay
      setTimeout(() => {
        refetch();
      }, 2000);
    } catch (error) {
      console.error("Failed to withdraw present:", error);
    }
  };

  const formatDate = (timestamp: bigint | string): string => {
    const numTimestamp = typeof timestamp === "string" ? parseInt(timestamp) : Number(timestamp);
    const date = new Date(numTimestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: bigint | string): string => {
    const numAmount = typeof amount === "string" ? BigInt(amount) : amount;
    const stx = Number(numAmount) / 1000000;
    return `${stx.toFixed(2)} STX`;
  };

  const currentUserAddress = walletInfo?.addresses?.[2]?.address || "";

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
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Present Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  formErrors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Special Gift for You"
              />
              {formErrors.title && (
                <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                STX Amount *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  formErrors.amount ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0.00"
              />
              {formErrors.amount && (
                <p className="mt-1 text-sm text-red-600">{formErrors.amount}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                This amount will be locked in the present and can be claimed by anyone with the password.
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Claim Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  formErrors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter password for claiming"
              />
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Share this password with the person who should claim this present.
              </p>
            </div>

            {/* Error Display */}
            {createError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  Error: {createError.message || "Failed to create present"}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ title: "", amount: "", password: "" });
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

      {/* Loading State */}
      {isLoadingPresents && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Loading presents...</p>
        </div>
      )}

      {/* Error State */}
      {presentsError && !isLoadingPresents && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-red-800 mb-2">
            Error Loading Presents
          </h2>
          <p className="text-red-600 mb-4">{presentsError.message}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Presents Grid */}
      {!isLoadingPresents && !presentsError && presents.length === 0 && (
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
      )}

      {/* Presents List */}
      {!isLoadingPresents && !presentsError && presents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {presents.map((present) => {
            const presentInfo = present.info;
            const claimed = presentInfo.claimed?.value || false;
            const claimer = presentInfo.claimer?.value || "";
            const creator = presentInfo.creator?.value || "";
            const title = presentInfo.title?.value || "";
            const amount = presentInfo.amount?.value || "0";
            const createdAt = presentInfo["created-at"]?.value || "0";
            const isClaimer = currentUserAddress && claimer === currentUserAddress;

            return (
              <div
                key={present.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition transform hover:scale-105 ${
                  claimed ? "opacity-75" : ""
                }`}
              >
                <div className="p-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    {claimed ? (
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

                  {/* Present Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {title}
                  </h3>

                  {/* Amount */}
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-red-600">
                      {formatAmount(amount)}
                    </p>
                    <p className="text-xs text-gray-500">Locked in present</p>
                  </div>

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
                    <span className="line-clamp-1 text-xs">
                      Created by: {creator.slice(0, 8)}...
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
                    <span className="text-xs">{formatDate(createdAt)}</span>
                  </div>

                  {/* Claimed By */}
                  {claimed && claimer && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <span className="font-semibold">Claimed by:</span>{" "}
                        {claimer.slice(0, 8)}...
                      </p>
                    </div>
                  )}

                  {/* Claim Form or Withdraw Button */}
                  {!claimed ? (
                    <div>
                      {claimingPresentId === present.id ? (
                        <div className="space-y-3">
                          <input
                            type="password"
                            value={claimPassword}
                            onChange={(e) => setClaimPassword(e.target.value)}
                            placeholder="Enter password to claim"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setClaimingPresentId(null);
                                setClaimPassword("");
                              }}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleClaimPresent(present.id)}
                              disabled={isClaiming}
                              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                            >
                              {isClaiming ? "Claiming..." : "Claim 🎁"}
                            </button>
                          </div>
                          {claimError && (
                            <p className="text-xs text-red-600">
                              {claimError.message}
                            </p>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => setClaimingPresentId(present.id)}
                          disabled={!isConnected || isClaiming}
                          className={`block w-full text-center px-4 py-2 rounded-lg font-semibold transition ${
                            !isConnected
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-red-600 text-white hover:bg-red-700"
                          }`}
                        >
                          {!isConnected
                            ? "Connect Wallet to Claim"
                            : "Claim Present 🎁"}
                        </button>
                      )}
                    </div>
                  ) : isClaimer ? (
                    <button
                      onClick={() => handleWithdrawPresent(present.id)}
                      disabled={isWithdrawing || withdrawingPresentId === present.id}
                      className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {isWithdrawing && withdrawingPresentId === present.id
                        ? "Withdrawing..."
                        : "Withdraw STX 💰"}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="block w-full text-center px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
                    >
                      Already Claimed
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
