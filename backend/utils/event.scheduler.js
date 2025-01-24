import schedule from "node-schedule";
import { Event } from "../models/event.model.js";

export const scheduleEventCompletion = () => {
  schedule.scheduleJob("*/1 * * * *", async () => {
    try {
      const currentTime = new Date();
      const expiredEvents = await Event.find({
        date: { $lte: currentTime },
        status: "upcoming",
      });

      for (const event of expiredEvents) {
        event.status = "completed";
        await event.save();
        console.log(`Event "${event.name}" marked as completed.`);
      }
    } catch (error) {
      console.error("Error scheduling event completion:", error);
    }
  });
};
