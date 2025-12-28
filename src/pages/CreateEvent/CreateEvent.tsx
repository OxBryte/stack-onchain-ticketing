import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateEvent } from "../../hooks/useContract";
import { useAuth } from "../../context/AuthContext";

export function CreateEvent() {
  const navigate = useNavigate();
  const { isConnected } = useAuth();
  const { createEvent, isLoading, error } = useCreateEvent();
  const { isAdmin, isLoadingAdmin, adminAddress } = useAdminCheck();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    venue: "",
    date: "",
    time: "",
    price: "",
    totalTickets: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Event name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.venue.trim()) {
      errors.venue = "Venue is required";
    }

    if (!formData.date) {
      errors.date = "Date is required";
    } else {
      const selectedDate = new Date(
        `${formData.date}T${formData.time || "00:00"}`
      );
      const now = new Date();
      if (selectedDate <= now) {
        errors.date = "Event date must be in the future";
      }
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = "Price must be greater than 0";
    }

    if (!formData.totalTickets || parseInt(formData.totalTickets) <= 0) {
      errors.totalTickets = "Total tickets must be greater than 0";
    } else if (parseInt(formData.totalTickets) > 10000) {
      errors.totalTickets = "Maximum 10,000 tickets allowed";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      alert("Please connect your wallet to create an event");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      // Combine date and time into Unix timestamp
      const dateTime = new Date(`${formData.date}T${formData.time || "00:00"}`);
      const unixTimestamp = Math.floor(dateTime.getTime() / 1000);

      // Convert price from STX to micro-STX
      const priceInMicroStx = Math.floor(parseFloat(formData.price) * 1000000);

      await createEvent({
        name: formData.name.trim(),
        description: formData.description.trim(),
        venue: formData.venue.trim(),
        date: unixTimestamp,
        price: priceInMicroStx,
        totalTickets: parseInt(formData.totalTickets),
      });

      alert("Event created successfully!");
      navigate("/events");
    } catch (err) {
      console.error("Failed to create event:", err);
      // Error is already handled by the hook
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Wallet Not Connected
          </h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to create an event.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Create New Event
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        {/* Event Name */}
        <div className="mb-6">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Event Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              formErrors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., Stacks Conference 2024"
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
          )}
        </div>

        {/* Description */}
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
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              formErrors.description ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Describe your event..."
          />
          {formErrors.description && (
            <p className="mt-1 text-sm text-red-600">
              {formErrors.description}
            </p>
          )}
        </div>

        {/* Venue */}
        <div className="mb-6">
          <label
            htmlFor="venue"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Venue *
          </label>
          <input
            type="text"
            id="venue"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
              formErrors.venue ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., Madison Square Garden, New York"
          />
          {formErrors.venue && (
            <p className="mt-1 text-sm text-red-600">{formErrors.venue}</p>
          )}
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                formErrors.date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.date && (
              <p className="mt-1 text-sm text-red-600">{formErrors.date}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="time"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Time
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Price and Total Tickets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Price (STX) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                formErrors.price ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0.00"
            />
            {formErrors.price && (
              <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="totalTickets"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Total Tickets *
            </label>
            <input
              type="number"
              id="totalTickets"
              name="totalTickets"
              value={formData.totalTickets}
              onChange={handleChange}
              min="1"
              max="10000"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                formErrors.totalTickets ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="100"
            />
            {formErrors.totalTickets && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.totalTickets}
              </p>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              Error: {error.message || "Failed to create event"}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating Event..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
