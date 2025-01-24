import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // Check for token in Authorization header or cookies
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user ID and decoded payload to the request object
    req.userId = decoded.userId;
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error in verifyToken middleware:", error.message);

    // Handle specific JWT errors
    const isProduction = process.env.NODE_ENV === "production";

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: isProduction
          ? "Unauthorized - Token is invalid."
          : "Unauthorized - Token has expired.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: isProduction
          ? "Unauthorized - Token is invalid."
          : "Unauthorized - Invalid token format.",
      });
    }

    // Handle other errors
    res.status(500).json({
      success: false,
      message: "Internal server error during token verification.",
    });
  }
};
