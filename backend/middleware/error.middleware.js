import ApiError from "../utils/apiError.js";

const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err.stack);

  if (err.name === "CastError") {
    err = new ApiError(400, "Invalid ID");
  }

  const statusCode = err.statusCode || 500;

  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};

export default errorMiddleware;