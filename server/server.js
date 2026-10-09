if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const port = process.env.PORT;

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const AppError = require("./errors/AppError.js");

const { sessionOptions, session } = require("./configs/session.config.js");
const { connectDB } = require("./configs/db.config.js");
const { notFound, errorHandler } = require("./middlewares/error.middleware.js");

const authRouter = require("./routes/auth.routes.js");
const storyRouter = require("./routes/story.routes.js");
const profileRouter = require("./routes/profile.routes.js");

const app = express();
// app.set("trust proxy", 1);

// Middleware to handle CORS
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: "100kb" }));
app.use(session(sessionOptions));

const start = async () => {
  await connectDB(); // must return the promise and throw on failure
  app.listen(port, () => console.log(`Server listening on port ${port}`));
};

app.use("/api/auth", authRouter);
app.use("/api/stories", storyRouter);
app.use("/api/users", profileRouter);

// Health check route (important for Render)
app.get("/", (_req, res) => {
  res.send("InciTeller API is running...");
});

app.all("/files{/*path}", (_req, _res, next) => {
  next(new AppError(404, "Page not found!"));
});

app.use(notFound); // anything no route matched
app.use(errorHandler); // must be last, and must have 4 parameters

start().catch((err) => {
  console.error("Failed to start server:", err.message); // message only, not the whole object
  process.exit(1);
});
