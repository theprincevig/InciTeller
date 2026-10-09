module.exports.notFound = (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
};

module.exports.errorHandler = (err, req, res, next) => {
  // If a response already started, Express must handle it.
  if (res.headersSent) return next(err);

  let status = 500;
  let message = "Something went wrong";

  if (err.type === "entity.parse.failed") {
    status = 400; // malformed JSON body
    message = "Invalid JSON in request body";
  } else if (err.type === "entity.too.large") {
    status = 413; // exceeded express.json limit
    message = "Request body too large";
  } else if (err.name === "ValidationError") {
    status = 400; // Mongoose schema validation
    message = Object.values(err.errors)[0].message;
  } else if (err.name === "CastError") {
    status = 400; // e.g. /experiences/not-an-id
    message = "Invalid ID";
  } else if (err.code === 11000) {
    status = 409; // duplicate key not handled locally
    message = "Duplicate value";
  } else if (err.name === "MulterError" || err.code === "INVALID_FILE_TYPE") {
    status = 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image must be 5MB or smaller"
        : err.message;
  }

  // Log real details on the server only. Never log req.body (it holds passwords).
  if (status === 500) console.error(`[${req.method} ${req.originalUrl}]`, err);

  res.status(status).json({ success: false, message });
};
