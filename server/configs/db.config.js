const mongoose = require("mongoose");

const DB_URI = process.env.ATLASDB_URI;

module.exports.connectDB = async () => {
  if (!DB_URI) {
    console.error("MongoDB connection string is missing (ATLASDB_URI not set)");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(DB_URI, {
      serverSelectionTimeoutMS: 10000, // give up after 10s instead of 30s
    });
    console.log(`Connected to DB: --> ${conn.connection.name} <--`);
  } catch (error) {
    console.error(`connection failed ${error.message}`);
    process.exit(1);
  }
};
