import { User } from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access denied. Admins only." });
    }
    next();
  } catch (error) {
    console.log("Error in isAdmin middleware:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
