const session = require("express-session");
const MongoStore = require("connect-mongo");

const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URI,
  // Use a fresh collection to avoid incompatible sessions
  // created by the previous encryption configuration.
  collectionName: "inciteller_sessions_v2",
  touchAfter: 24 * 3600,
}).on("error", (err) => console.log(`ERROR in Mongo session store: ${err}`));

const sessionOptions = {
  name: "incitellerSid",
  store,
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
};

module.exports = { session, sessionOptions };
