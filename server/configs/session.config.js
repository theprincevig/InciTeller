const session = require("express-session");
const MongoStore = require("connect-mongo");

const store = MongoStore.create({
  mongoUrl: process.env.ATLASDB_URI,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
}).on("error", (err) => console.log(`ERROR in Mongo session store: ${err}`));

const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET,
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
