import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    contact: { type: String, default: "" },
    location: { type: String, default: "" },
    socialLinks: {
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
      companyWebsite: { type: String, default: "" },
    },
    profileImage: { type: String, default: "" }, // URL or file name of the profile image
    qrCode: { type: String, default: "" }, // Base64-encoded QR code
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
