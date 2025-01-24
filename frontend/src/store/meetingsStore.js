import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/meetings"
    : "/api/meetings";

axios.defaults.withCredentials = true;

export const useMeetingsStore = create((set) => ({
  meetings: [],
  isLoading: false,
  error: null,

  // Fetch all meetings
  fetchMeetings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ meetings: response.data.meetings, isLoading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to load meetings",
        isLoading: false,
      });
    }
  },

  // Create a meeting
  createMeeting: async (meetingData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(API_URL, meetingData);
      set((state) => ({
        meetings: [...state.meetings, response.data.meeting],
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to create meeting",
        isLoading: false,
      });
      throw err;
    }
  },

  // Delete a meeting
  deleteMeeting: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({
        meetings: state.meetings.filter((meeting) => meeting._id !== id),
        isLoading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to delete meeting",
        isLoading: false,
      });
      throw err;
    }
  },
}));
