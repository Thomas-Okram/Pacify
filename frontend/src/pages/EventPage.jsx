import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const EventPage = ({ isAdmin }) => {
  const [events, setEvents] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    date: "",
    ticketPrice: "",
    totalSeats: "",
    image: null,
  });
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    maxDiscount: "",
    usageLimit: "",
    startDate: "",
    endDate: "",
  });
  const [discountCodes, setDiscountCodes] = useState({});
  const [selectedEventId, setSelectedEventId] = useState("");

  useEffect(() => {
    fetchEvents();
    fetchMyTickets();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/events");
      setEvents(data.events || []);
      setPastEvents(data.pastEvents || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchMyTickets = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/events/my-tickets"
      );

      const enrichedTickets = data.tickets.map((ticket) => ({
        ...ticket,
        eventName: ticket.event?.name || "No Event Name",
        eventDescription: ticket.event?.description || "No Description",
        eventDate: ticket.event?.date || "No Date",
        eventImage: ticket.event?.image || "",
        qrCode: ticket.qrCode, // Use the QR code from the response
      }));

      setMyTickets(enrichedTickets || []);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/events/tickets/${ticketId}`
        );
        alert("Ticket deleted successfully!");
        fetchMyTickets(); // Refresh tickets after deletion
      } catch (error) {
        console.error("Error deleting ticket:", error);
        alert("Failed to delete the ticket.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setNewEvent((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleAddEvent = async () => {
    const formData = new FormData();
    formData.append("name", newEvent.name);
    formData.append("description", newEvent.description);
    formData.append("date", newEvent.date);
    formData.append("ticketPrice", newEvent.ticketPrice);
    formData.append("totalSeats", newEvent.totalSeats);
    formData.append("image", newEvent.image);

    try {
      await axios.post("http://localhost:5000/api/events", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchEvents();
      setNewEvent({
        name: "",
        description: "",
        date: "",
        ticketPrice: "",
        totalSeats: "",
        image: null,
      });
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`);
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleDiscountCodeChange = (eventId, value) => {
    setDiscountCodes((prev) => ({ ...prev, [eventId]: value }));
  };

  const handleApplyCoupon = async (eventId) => {
    const couponCode = discountCodes[eventId];
    if (!couponCode) {
      alert("Please enter a coupon code.");
      return;
    }

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/events/${eventId}/book/initiate`,
        { couponCode }
      );

      if (data.ticket) {
        // 100% discount booking
        setMyTickets((prev) => [...prev, data.ticket]);
        alert("Ticket booked successfully with 100% discount!");
        fetchEvents();
      } else {
        alert(`Coupon applied! New ticket price: ₹${data.ticketPrice}`);
      }
    } catch (error) {
      console.error(
        "Error applying coupon:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Failed to apply coupon.");
    }
  };

  const handleBookEvent = async (eventId) => {
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/events/${eventId}/book/confirm`,
        { couponCode: discountCodes[eventId] }
      );
      setMyTickets((prev) => [...prev, data.ticket]);
      alert("Ticket booked successfully!");
      fetchEvents();
      setDiscountCodes((prev) => ({ ...prev, [eventId]: "" }));
    } catch (error) {
      console.error(
        "Error booking event:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Failed to book ticket.");
    }
  };

  const handleCouponInputChange = (e) => {
    const { name, value } = e.target;
    setNewCoupon((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCoupon = async () => {
    if (!selectedEventId) {
      alert("Please select an event to add the coupon.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/events/${selectedEventId}/coupons`,
        newCoupon
      );
      alert("Coupon added successfully");
      fetchEvents();
      setNewCoupon({
        code: "",
        discount: "",
        maxDiscount: "",
        usageLimit: "",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      console.error("Error adding coupon:", error);
    }
  };

  const handleDeleteCoupon = async (eventId, couponCode) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/events/${eventId}/coupons/${couponCode}`
      );
      alert("Coupon deleted successfully");
      fetchEvents();
    } catch (error) {
      console.error(
        "Error deleting coupon:",
        error.response?.data?.message || error.message
      );
      alert(error.response?.data?.message || "Failed to delete coupon.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black text-white">
      {/* Events Section */}
      <section className="py-20 px-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-green-400">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="p-6 bg-gray-800 rounded-lg shadow-lg"
            >
              <img
                src={`http://localhost:5000/uploads/events/${event.image}`}
                alt={event.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold text-green-400 mb-2">
                {event.name}
              </h3>
              <p className="text-gray-300">{event.description}</p>
              <p className="text-gray-400 mt-2">
                Date: {new Date(event.date).toLocaleString()}
              </p>
              <p className="text-gray-400">Price: ₹{event.ticketPrice}</p>
              <p className="text-gray-400">
                Seats Left: {event.availableSeats}
              </p>

              {/* Coupons Section */}
              <div className="mt-4">
                <h4 className="text-lg font-bold text-gray-400">Coupons:</h4>
                {event.coupons.length > 0 ? (
                  <ul className="mt-2 space-y-2">
                    {event.coupons.map((coupon) => (
                      <li
                        key={coupon.code}
                        className="bg-gray-700 p-2 rounded text-white"
                      >
                        <div>
                          <strong>Code:</strong> {coupon.code}
                        </div>
                        <div>
                          <strong>Discount:</strong> {coupon.discount}%
                        </div>
                        <div>
                          <strong>Max Discount:</strong> ₹
                          {coupon.maxDiscount || "No limit"}
                        </div>
                        <div>
                          <strong>Usage Limit:</strong>{" "}
                          {coupon.usageLimit || "Unlimited"}
                        </div>
                        <div>
                          <strong>Times Used:</strong> {coupon.timesUsed}
                        </div>
                        <div>
                          <strong>Validity:</strong>{" "}
                          {coupon.startDate
                            ? new Date(coupon.startDate).toLocaleDateString()
                            : "No start"}{" "}
                          -{" "}
                          {coupon.endDate
                            ? new Date(coupon.endDate).toLocaleDateString()
                            : "No end"}
                        </div>
                        {isAdmin && (
                          <button
                            onClick={() =>
                              handleDeleteCoupon(event._id, coupon.code)
                            }
                            className="mt-2 w-full py-1 px-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
                          >
                            Delete Coupon
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">No coupons available</p>
                )}
              </div>

              <input
                type="text"
                placeholder="Discount Code"
                value={discountCodes[event._id] || ""}
                onChange={(e) =>
                  handleDiscountCodeChange(event._id, e.target.value)
                }
                className="w-full p-2 mt-2 bg-gray-700 text-white rounded"
              />
              <button
                onClick={() => handleApplyCoupon(event._id)}
                className="mt-2 w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
              >
                Apply Coupon
              </button>
              <button
                onClick={() => handleBookEvent(event._id)}
                className="mt-4 w-full py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
              >
                Book Now
              </button>
              {isAdmin && (
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="mt-2 w-full py-2 px-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 flex items-center justify-center"
                >
                  <FaTrash className="mr-2" /> Delete Event
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* My Tickets Section */}
      <section className="py-20 px-10 bg-gray-900">
        <h2 className="text-3xl font-bold text-center mb-10 text-green-400">
          My Tickets
        </h2>
        <div className="space-y-6">
          {myTickets.map((ticket) => (
            <div
              key={ticket._id}
              className="flex flex-col md:flex-row bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 border-green-500 relative"
            >
              {/* Left Side - Event and User Information */}
              <div className="flex-1 p-6 bg-gray-700 text-white">
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  {ticket.eventName || "Event Name Not Available"}
                </h3>
                <p className="text-gray-200 mb-2">
                  {ticket.eventDescription || "No Description Available"}
                </p>
                <p className="text-gray-400 mb-1">
                  <strong>Date:</strong>{" "}
                  {ticket.eventDate
                    ? new Date(ticket.eventDate).toLocaleString()
                    : "No Date Provided"}
                </p>
                <p className="text-gray-400 mb-1">
                  <strong>Seat Number:</strong> {ticket.seatNumber || "N/A"}
                </p>
                <p className="text-gray-400 mb-1">
                  <strong>Price Paid:</strong> ₹{ticket.price || "Free"}
                </p>
                <p className="text-gray-400 mt-4">
                  <strong>User Information:</strong>
                </p>
                <p className="text-gray-300">
                  <strong>Name:</strong> {ticket.user?.name || "Anonymous"}
                </p>
                <p className="text-gray-300">
                  <strong>Email:</strong>{" "}
                  {ticket.user?.email || "Not Available"}
                </p>
              </div>

              {/* Right Side - QR Code and Event Image */}
              <div className="flex flex-col items-center justify-center p-6 bg-gray-900">
                {ticket.eventImage ? (
                  <img
                    src={`http://localhost:5000/uploads/events/${ticket.eventImage}`}
                    alt="Event"
                    className="w-48 h-48 object-cover rounded-md mb-4"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
                    No Image Available
                  </div>
                )}
                {ticket.qrCode ? (
                  <img
                    src={ticket.qrCode}
                    alt="QR Code"
                    className="w-32 h-32 object-contain"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
                    QR Code Not Available
                  </div>
                )}
              </div>

              {/* Delete Button - Positioned at the Bottom Center */}
              <button
                onClick={() => handleDeleteTicket(ticket._id)}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white font-bold py-1 px-4 rounded-lg hover:bg-red-600"
              >
                Delete Ticket
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Past Events Section */}
      <section className="py-20 px-10 bg-black">
        <h2 className="text-3xl font-bold text-center mb-10 text-yellow-400">
          Past Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pastEvents.map((event) => (
            <div
              key={event._id}
              className="p-6 bg-gray-800 rounded-lg shadow-lg"
            >
              <img
                src={`http://localhost:5000/uploads/events/${event.image}`}
                alt={event.name}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              <h3 className="text-xl font-bold text-yellow-400 mb-2">
                {event.name}
              </h3>
              <p className="text-gray-300">{event.description}</p>
              <p className="text-gray-400">
                Date: {new Date(event.date).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Admin: Add Event */}
      {isAdmin && (
        <section className="py-20 px-10 bg-gray-900">
          <h2 className="text-3xl font-bold text-center mb-10 text-green-400">
            Add New Event
          </h2>
          <div className="max-w-lg mx-auto">
            <input
              type="text"
              name="name"
              value={newEvent.name}
              onChange={handleInputChange}
              placeholder="Event Name"
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <textarea
              name="description"
              value={newEvent.description}
              onChange={handleInputChange}
              placeholder="Event Description"
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <input
              type="datetime-local"
              name="date"
              value={newEvent.date}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <input
              type="number"
              name="ticketPrice"
              value={newEvent.ticketPrice}
              onChange={handleInputChange}
              placeholder="Ticket Price"
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <input
              type="number"
              name="totalSeats"
              value={newEvent.totalSeats}
              onChange={handleInputChange}
              placeholder="Available Seats"
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <button
              onClick={handleAddEvent}
              className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
            >
              Add Event
            </button>
          </div>
        </section>
      )}

      {/* Admin: Add Coupons */}
      {isAdmin && (
        <section className="py-20 px-10 bg-gray-900">
          <h2 className="text-3xl font-bold text-center mb-10 text-green-400">
            Add Coupon
          </h2>
          <div className="max-w-lg mx-auto">
            <select
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
            >
              <option value="">Select an Event</option>
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="code"
              value={newCoupon.code}
              onChange={handleCouponInputChange}
              placeholder="Coupon Code"
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <input
              type="number"
              name="discount"
              value={newCoupon.discount}
              onChange={handleCouponInputChange}
              placeholder="Discount (%)"
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <input
              type="number"
              name="maxDiscount"
              value={newCoupon.maxDiscount}
              onChange={handleCouponInputChange}
              placeholder="Max Discount Amount"
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <input
              type="number"
              name="usageLimit"
              value={newCoupon.usageLimit}
              onChange={handleCouponInputChange}
              placeholder="Usage Limit"
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <input
              type="datetime-local"
              name="startDate"
              value={newCoupon.startDate}
              onChange={handleCouponInputChange}
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <input
              type="datetime-local"
              name="endDate"
              value={newCoupon.endDate}
              onChange={handleCouponInputChange}
              className="w-full p-2 mb-4 bg-gray-800 text-white rounded"
            />
            <button
              onClick={handleAddCoupon}
              className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
            >
              Add Coupon
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

EventPage.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

export default EventPage;
