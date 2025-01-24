import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Razorpay from "razorpay";
import QRCode from "qrcode";
import { Event } from "../models/event.model.js";
import { Ticket } from "../models/ticket.model.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Configure Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads/events");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Admin: Create Event
router.post(
  "/",
  verifyToken,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    const { name, description, date, ticketPrice, totalSeats, coupons } =
      req.body;

    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Image is required" });
      }

      const event = new Event({
        name,
        description,
        date,
        ticketPrice,
        totalSeats,
        availableSeats: totalSeats,
        coupons: coupons ? JSON.parse(coupons) : [],
        image: req.file.filename,
      });

      await event.save();
      res
        .status(201)
        .json({ success: true, message: "Event created successfully", event });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// User: Initiate Payment or Direct Booking for 100% Discount
router.post("/:id/book/initiate", verifyToken, async (req, res) => {
  const { couponCode } = req.body;

  try {
    const event = await Event.findById(req.params.id);

    if (!event || event.availableSeats === 0) {
      return res.status(400).json({
        success: false,
        message: "Event is fully booked or not available",
      });
    }

    let ticketPrice = event.ticketPrice;
    let isFree = false;

    // Apply coupon if provided
    if (couponCode) {
      const coupon = event.coupons.find((c) => {
        const now = new Date();
        return (
          c.code === couponCode &&
          (!c.startDate || new Date(c.startDate) <= now) &&
          (!c.endDate || new Date(c.endDate) >= now) &&
          (!c.usageLimit || c.timesUsed < c.usageLimit)
        );
      });

      if (coupon) {
        const discount = (coupon.discount / 100) * ticketPrice;
        ticketPrice -= Math.min(discount, coupon.maxDiscount || ticketPrice);

        if (ticketPrice === 0) isFree = true;

        // Increment coupon usage if valid
        coupon.timesUsed = (coupon.timesUsed || 0) + 1;
        await event.save();
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid or expired coupon code" });
      }
    }

    if (isFree) {
      // Skip payment and directly confirm booking
      const seatNumber = event.totalSeats - event.availableSeats + 1;

      const ticket = new Ticket({
        user: req.userId,
        event: event._id,
        seatNumber,
        price: 0,
        paymentId: "FREE_BOOKING",
      });

      await ticket.save();
      event.availableSeats -= 1;
      await event.save();

      // Generate QR Code
      const ticketData = {
        ticketId: ticket._id,
        eventName: event.name,
        seatNumber,
        price: 0,
        user: req.userId,
      };
      const qrCode = await QRCode.toDataURL(JSON.stringify(ticketData));

      return res.status(201).json({
        success: true,
        message: "Ticket booked successfully with 100% discount",
        ticket,
        qrCode,
      });
    }

    // Create Razorpay Order for paid bookings
    const order = await razorpay.orders.create({
      amount: ticketPrice * 100, // Amount in paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(201).json({
      success: true,
      orderId: order.id,
      ticketPrice,
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// User: Confirm Booking after Payment
router.post("/:id/book/confirm", verifyToken, async (req, res) => {
  const { razorpayPaymentId, couponCode } = req.body;

  try {
    const event = await Event.findById(req.params.id);

    if (!event || event.availableSeats === 0) {
      return res.status(400).json({
        success: false,
        message: "Event is fully booked or not available",
      });
    }

    let ticketPrice = event.ticketPrice;

    // Apply coupon if provided
    if (couponCode) {
      const coupon = event.coupons.find((c) => c.code === couponCode);
      if (coupon) {
        const discount = (coupon.discount / 100) * ticketPrice;
        ticketPrice -= discount;
      }
    }

    const seatNumber = event.totalSeats - event.availableSeats + 1;

    // Create a new ticket
    const ticket = new Ticket({
      user: req.userId,
      event: event._id,
      seatNumber,
      price: ticketPrice,
      paymentId: razorpayPaymentId,
    });

    // Generate QR Code for the ticket
    const ticketData = {
      ticketId: ticket._id,
      eventName: event.name,
      seatNumber,
      price: ticketPrice,
      user: req.userId,
    };

    const qrCode = await QRCode.toDataURL(JSON.stringify(ticketData));
    ticket.qrCode = qrCode; // Save QR code to the ticket
    await ticket.save();

    console.log(qrCode);

    // Update available seats
    event.availableSeats -= 1;
    await event.save();

    res.status(201).json({
      success: true,
      message: "Ticket booked successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error confirming booking:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Get All Events
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ success: true, events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Admin: Update Event
router.put(
  "/:id",
  verifyToken,
  isAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const updateData = { ...req.body };
      if (req.file) {
        updateData.image = req.file.filename;
      }

      const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      if (!event) {
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Event updated successfully", event });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// Admin: Delete Event
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Admin: Create Coupon
router.post("/:id/coupons", verifyToken, isAdmin, async (req, res) => {
  const { code, discount, maxDiscount, usageLimit, startDate, endDate } =
    req.body;

  if (!code || !discount) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    event.coupons.push({
      code,
      discount,
      maxDiscount,
      usageLimit,
      startDate,
      endDate,
      timesUsed: 0,
    });
    await event.save();

    res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      event,
    });
  } catch (error) {
    console.error("Error creating coupon:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Admin: Delete Coupon
router.delete(
  "/:id/coupons/:couponCode",
  verifyToken,
  isAdmin,
  async (req, res) => {
    const { id, couponCode } = req.params;

    try {
      const event = await Event.findById(id);
      if (!event) {
        return res
          .status(404)
          .json({ success: false, message: "Event not found" });
      }

      // Find and remove the coupon
      const couponIndex = event.coupons.findIndex((c) => c.code === couponCode);
      if (couponIndex === -1) {
        return res
          .status(404)
          .json({ success: false, message: "Coupon not found" });
      }

      event.coupons.splice(couponIndex, 1);
      await event.save();

      res.status(200).json({
        success: true,
        message: "Coupon deleted successfully",
        event,
      });
    } catch (error) {
      console.error("Error deleting coupon:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// Get My Tickets
router.get("/my-tickets", verifyToken, async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.userId })
      .populate("event")
      .populate("user", "name email"); // Populate user details

    res.status(200).json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// User: Delete Ticket
router.delete("/tickets/:id", verifyToken, async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    // Optionally, update the event to increment availableSeats
    const event = await Event.findById(ticket.event);
    if (event) {
      event.availableSeats += 1;
      await event.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
