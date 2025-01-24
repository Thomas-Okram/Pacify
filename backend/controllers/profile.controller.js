import { Profile } from "../models/profile.model.js";
import { User } from "../models/user.model.js";
import QRCode from "qrcode";

// Get Profile by User ID
export const getProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    let profile = await Profile.findOne({ userId });
    if (!profile) {
      console.log("Profile not found. Creating a default profile...");
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      profile = new Profile({
        userId: user._id,
        name: user.name,
        description: "",
        contact: "",
        location: "",
        socialLinks: {},
      });
      await profile.save();
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Create or Update Profile
export const updateProfile = async (req, res) => {
  const { userId, name, description, contact, location, socialLinks } =
    req.body;

  try {
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
      message: "Profile updated successfully",
      profile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Upload Profile Picture
export const uploadProfilePicture = async (req, res) => {
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
      return res
        .status(404)
        .json({ success: false, message: "Profile not found." });
    }

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully.",
      profile,
    });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Generate QR Code for Profile
export const generateQRCode = async (req, res) => {
  const { userId } = req.params;
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  try {
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found." });
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
    console.error("Error generating QR Code:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
