import express from "express";
import multer from "multer";
import QRCode from "qrcode";
import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file names
  },
});

const upload = multer({ storage });

// Route: Get Profile by User ID
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    let profile = await Profile.findOne({ userId });
    if (!profile) {
      console.log("Profile not found. Creating a default profile...");
      const user = await User.findById(userId); // Fetch the user data
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      // Create a default profile
      profile = new Profile({
        userId: user._id,
        name: user.name, // Default name from user
        description: "",
        contact: "",
        location: "",
        socialLinks: {},
      });
      await profile.save();
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Error fetching profile:", error.message || error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Route: Create or Update Profile
router.post("/", upload.single("profileImage"), async (req, res) => {
  try {
    const { userId, name, description, contact, location, socialLinks } =
      req.body;

    if (!userId || !name) {
      return res.status(400).json({
        success: false,
        message: "User ID and Name are required.",
      });
    }

    const profileData = {
      userId,
      name,
      description: description || "",
      contact: contact || "",
      location: location || "",
      socialLinks: socialLinks
        ? typeof socialLinks === "string"
          ? JSON.parse(socialLinks)
          : socialLinks
        : {},
    };

    if (req.file) {
      profileData.profileImage = req.file.filename;
    }

    const profile = await Profile.findOneAndUpdate({ userId }, profileData, {
      new: true,
      upsert: true, // Create the profile if it doesn't exist
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      profile,
    });
  } catch (error) {
    console.error("Error updating profile:", error.message || error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Route: Delete Profile by User ID
router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await Profile.findOneAndDelete({ userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting profile:", error.message || error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Route: Upload Profile Picture
router.post(
  "/upload-picture",
  upload.single("profileImage"),
  async (req, res) => {
    const { userId } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded." });
    }

    try {
      const profile = await Profile.findOneAndUpdate(
        { userId },
        { profileImage: req.file.filename },
        { new: true }
      );

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "Profile not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Profile picture updated successfully.",
        profile,
      });
    } catch (error) {
      console.error("Error uploading profile picture:", error.message || error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

// Route: Generate QR Code for Profile
router.get("/:userId/generate-qrcode", async (req, res) => {
  const { userId } = req.params;
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  try {
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
      });
    }

    const profileUrl = `${clientUrl}/profile/${userId}`;
    const qrCode = await QRCode.toDataURL(profileUrl);

    profile.qrCode = qrCode;
    await profile.save();

    res.status(200).json({
      success: true,
      message: "QR Code generated successfully.",
      qrCode,
    });
  } catch (error) {
    console.error("Error generating QR Code:", error.message || error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
