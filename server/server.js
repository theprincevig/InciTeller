if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const port = process.env.PORT || 3000;

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { sessionOptions, session } = require("./configs/session.config.js");
const { connectDB } = require("./configs/db.config.js");

const app = express();

// Middleware to handle CORS
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

app.use(helmet());
app.use(express.json());
app.use(cors(corsOptions));
app.use(session(sessionOptions));

connectDB();

// Health check route (important for Render)
app.get("/", (req, res) => {
  res.send("InciTeller API is running...");
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
