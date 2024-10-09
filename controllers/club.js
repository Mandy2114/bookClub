const express = require("express");
const router = express.Router();

const User = require("../models/user.js");
const Club = require("../models/club.js");
const Book = require("../models/book.js");

router.get("/", async (req, res) => {
  const clubs = await Club.find({});
  res.render("clubs/index.ejs", { clubs });
});

router.get("/:clubId/edit", async (req, res) => {
  const club = await Club.findById(req.params.clubId);
  res.render("clubs/edit.ejs", { club });
}); // render clubs/edit.ejs

router.put("/:clubId", async (req, res) => {
  let { clubId } = req.params;
  let updateClubData = req.body;

  try {
    const updateClub = await Club.findByIdAndUpdate(clubId, updateClubData, {
      new: true,
    });
    if (!updateClub) {
      return res.status(404).send("Club not found");
    }
    res.redirect(`/clubs/${clubId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal sever error");
  }
}); // process PUT request to update current club, and redirect to show page

router.put("/:clubId/join", async (req, res) => {
  let { clubId } = req.params;

  try {
    const updateClub = await Club.findByIdAndUpdate(clubId, {
      $addToSet: { members: req.session.user._id },
    });
    if (!updateClub) {
      return res.status(404).send("Club not found");
    }
    res.redirect(`/clubs/${clubId}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal sever error");
  }
}); // process PUT request to update current club, and redirect to show page

router.get("/create", async (req, res) => {
  const books = await Book.find({});
  res.render("clubs/create.ejs", { books });
}); // render clubs/create.ejs

router.post("/", async (req, res) => {
  let newClubData = req.body;
  newClubData.owner = req.session.user._id;

  try {
    const newClub = await Club.create(newClubData);
    res.redirect(`/clubs/${newClub._id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal sever error");
  }
}); // process POST request to create a new club, redirect to show page

router.get("/:clubId", async (req, res) => {
  let { clubId } = req.params;
  let userId = req.session.user._id;

  try {
    const userClubs = await Club.find({ owner: userId }).populate(
      "owner members book"
    );
    const memberClubs = await Club.find({
      members: { $in: [userId] },
    }).populate("owner members book");

    let club;
    if (clubId !== "noClub") {
      club = await Club.findById(clubId).populate("owner members book");
    } else {
      if (userClubs.length) {
        club = userClubs[0];
      } else {
        club = clubId;
      }
    }

    console.log("CLUB: ", club);
    console.log("MEMBERS CLUBS: ", memberClubs);

    if (!club) {
      return res.status(404).send("Club not found");
    }

    let isOwnerOrMember =
      club?.owner?._id.toString() === userId ||
      club?.members?.find((member) => member._id.toString() === userId);

    res.render("clubs/show.ejs", {
      club,
      userClubs,
      memberClubs,
      isOwnerOrMember,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal sever error");
  }
}); // Update logic for whether a user has a club already (or loggin in)

router.delete("/:clubId", async (req, res) => {
  try {
    console.log("Hello");
    const deleteClub = await Club.findByIdAndDelete(req.params.clubId);

    if (!deleteClub) {
      return res.status(404).json({ message: "Club not found" });
    }
    res.status(204).redirect("/clubs/noClub");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = router;
