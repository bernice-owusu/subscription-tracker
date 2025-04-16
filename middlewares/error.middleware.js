const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;
    console.error(err);

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new Error(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      const message = `Duplicate field value entered: ${JSON.stringify(
        err.keyValue
      )}`;
      error = new Error(message, 400);
    }
    // Mongoose validation error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
      error = new Error(message, 400);
    }
    // Mongoose expired token error
    if (err.name === "TokenExpiredError") {
      const message = `Token expired`;
      error = new Error(message, 401);
    }
    // Mongoose invalid token error
    if (err.name === "JsonWebTokenError") {
      const message = `Invalid token`;
      error = new Error(message, 401);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Server Error",
    });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
