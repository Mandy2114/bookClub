const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const authController = require("./controllers/auth.js");
const clubController = require("./controllers/club.js");
const bookController = require("./controllers/book.js");

const port = process.env.PORT ? process.env.PORT : "3000";

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passUserToView);

const Club = require("./models/club.js");

app.get("/", async (req, res) => {
  if (req.session.user) {
    try {
      const userClubs = await Club.find({ owner: req.session.user._id });

      if (userClubs.length) {
        res.redirect(`/clubs/${userClubs[0]._id}`);
      } else {
        res.redirect("/clubs/noClub");
      }
    } catch (error) {
      console.error("Error fetching user clubs:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.render("index.ejs");
  }
});

app.use("/auth", authController);
app.use(isSignedIn);
app.use("/clubs", clubController);
app.use("/books", bookController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
