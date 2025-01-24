import { Meeting } from "../models/meeting.model.js";

// Create a meeting (Admin only)
export const createMeeting = async (req, res) => {
  try {
    const { title, description, date, time, zoomLink } = req.body;

    // Validate required fields
    if (!title || !date || !time || !zoomLink) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    // Validate date format
    if (isNaN(Date.parse(date))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid date format." });
    }

    // Create a new meeting
    const meeting = new Meeting({
      title,
      description,
      date: new Date(date).toISOString(), // Store date in UTC
      time,
      zoomLink,
      createdBy: req.userId,
    });

    await meeting.save();

    res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      meeting,
    });
  } catch (error) {
    console.error(`Error in ${req.method} ${req.originalUrl}:`, error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all meetings
export const getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().sort({ date: 1 }); // Sort meetings by date
    res.status(200).json({ success: true, meetings });
  } catch (error) {
    console.error(`Error in ${req.method} ${req.originalUrl}:`, error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a meeting (Admin only)
export const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the meeting by ID
    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return res
        .status(404)
        .json({ success: false, message: "Meeting not found." });
    }

    // Delete the meeting
    await meeting.deleteOne();

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully.",
    });
  } catch (error) {
    console.error(`Error in ${req.method} ${req.originalUrl}:`, error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
