const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  users: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User"
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    require: true,
  },
  meetingLocation: {
    type: String,
  },
  description: {
    type: String,
  },
});

const Club = mongoose.model("Club", clubSchema);

module.exports = Club;