import express from "express";
import {
  createMeeting,
  getMeetings,
  deleteMeeting,
} from "../controllers/meeting.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Get all meetings (accessible to all authenticated users)
router.get("/", verifyToken, getMeetings);

// Create a meeting (Admin only)
router.post("/", verifyToken, isAdmin, createMeeting);

// Delete a meeting (Admin only)
router.delete("/:id", verifyToken, isAdmin, deleteMeeting);

export default router;
