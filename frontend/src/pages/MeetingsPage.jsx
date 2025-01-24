import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useMeetingsStore } from "../store/meetingsStore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MeetingsPage = ({ isAdmin }) => {
  const {
    meetings,
    fetchMeetings,
    createMeeting,
    deleteMeeting,
    isLoading,
    error,
  } = useMeetingsStore();

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    zoomLink: "",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMeeting({ ...newMeeting, [name]: value });
  };

  const handleAddMeeting = async () => {
    try {
      await createMeeting(newMeeting);
      setNewMeeting({
        title: "",
        description: "",
        date: "",
        time: "",
        zoomLink: "",
      });
      setShowForm(false);
      toast.success("Meeting created successfully!");
    } catch {
      toast.error("Failed to create meeting.");
    }
  };

  const handleDeleteMeeting = async (id) => {
    try {
      await deleteMeeting(id);
      toast.success("Meeting deleted successfully!");
    } catch {
      toast.error("Failed to delete meeting.");
    }
  };

  return (
    <div
      className="w-full min-h-screen bg-gradient-to-br from-green-900 via-gray-900 to-black text-white"
      style={{
        backgroundImage: "url('asset/hero/pexels-thirdman-7652040.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative pt-24 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center text-green-400">
          Meetings
        </h1>

        {isAdmin && (
          <div className="text-center mb-10">
            <button
              onClick={() => setShowForm(!showForm)}
              className="py-2 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
            >
              {showForm ? "Cancel" : "Create Meeting"}
            </button>
          </div>
        )}

        {showForm && isAdmin && (
          <div className="max-w-lg w-full mx-auto mb-10 p-6 bg-gray-800 bg-opacity-80 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-center text-green-400">
              Schedule a New Meeting
            </h2>
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newMeeting.title}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newMeeting.description}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            />
            <input
              type="date"
              name="date"
              value={newMeeting.date}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            />
            <input
              type="time"
              name="time"
              value={newMeeting.time}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            />
            <input
              type="url"
              name="zoomLink"
              placeholder="Zoom Link"
              value={newMeeting.zoomLink}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
            />
            <button
              onClick={handleAddMeeting}
              className="w-full py-2 px-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Add Meeting"}
            </button>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-400">
          Upcoming Meetings
        </h2>

        {isLoading ? (
          <p className="text-center text-gray-400">Loading meetings...</p>
        ) : meetings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meetings.map((meeting) => (
              <div
                key={meeting._id}
                className="p-6 bg-opacity-80 rounded-lg shadow-lg bg-gray-800"
              >
                <h3 className="text-xl font-bold text-green-400 mb-2">
                  {meeting.title}
                </h3>
                <p className="text-gray-300 mb-2">{meeting.description}</p>
                <p className="text-gray-400 mb-1">
                  <strong>Date:</strong>{" "}
                  {new Date(meeting.date).toLocaleDateString()}
                </p>
                <p className="text-gray-400 mb-1">
                  <strong>Time:</strong> {meeting.time}
                </p>
                <a
                  href={meeting.zoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline mb-2 block"
                >
                  Join Meeting
                </a>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteMeeting(meeting._id)}
                    className="mt-4 w-full py-2 px-4 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
                  >
                    Delete Meeting
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            No upcoming meetings found.
          </p>
        )}
      </div>
    </div>
  );
};

MeetingsPage.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
};

export default MeetingsPage;
