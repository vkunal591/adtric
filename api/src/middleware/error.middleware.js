const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode
    || (err.name === "MulterError" ? 400 : null)
    || (err.name === "ValidationError" ? 400 : null)
    || (err.code === 11000 ? 409 : 500);

  const errors = err.name === "ValidationError"
    ? Object.fromEntries(
      Object.entries(err.errors).map(([field, fieldError]) => [field, fieldError.message])
    )
    : undefined;

  res.status(statusCode).json({
    success: false,
    message: err.code === "LIMIT_FILE_SIZE"
      ? "Image must be 2 MB or smaller."
      : err.code === 11000
        ? "A record with these details already exists."
        : err.message || "Internal server error.",
    ...(errors ? { errors } : {})
  });
};

export default errorHandler;
