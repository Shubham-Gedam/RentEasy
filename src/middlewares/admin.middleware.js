const adminMiddleware = (req, res, next) => {
  try {
    // authMiddleware pehle hi user ko attach karega req.user me
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized access",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admins only.",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default adminMiddleware;
