import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["upcoming", "completed"],
    default: "upcoming",
  },
  defaultDiscount: {
    type: Number, // Discount as a percentage (e.g., 5 for 5%)
    default: 0,
  },
  coupons: [
    {
      code: { type: String, required: true },
      discount: { type: Number, required: true }, // Discount as a percentage
      maxDiscount: { type: Number }, // Maximum discount amount
      usageLimit: { type: Number }, // Maximum times the coupon can be used
      timesUsed: { type: Number, default: 0 }, // Track usage
      startDate: { type: Date }, // When the coupon becomes valid
      endDate: { type: Date }, // When the coupon expires
    },
  ],
  image: {
    type: String,
    required: true,
  },
});

export const Event = mongoose.model("Event", eventSchema);
