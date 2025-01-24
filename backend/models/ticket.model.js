import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  seatNumber: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  paymentId: {
    type: String,
  },
  qrCode: {
    type: String, // Store the QR code as a base64 string
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Ticket = mongoose.model("Ticket", ticketSchema);
