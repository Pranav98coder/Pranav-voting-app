// This function with 4 arguments IS the Global Middleware
export const errorHandler = (err, req, res, next) => {
  // It receives the 'err' object passed from your controller
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // It sends the final response to the user
  return res.status(statusCode).json({
    success: false,
    message: message,
    errors: err.errors || [],
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};
