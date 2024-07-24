const mongoose = require("../database/mongodb");


const documentSchema = new mongoose.Schema({
  eventid: { type: String, required: true },
  eventName: {
    type: String,
    required: false,
  },
  time: {
    type: Number,
    required: false,
  },
  startTime: {
    type: Date,
    required: false,
  },
  endTime: {
    type: Date,
    required: false,
  },
  users: {
    type: [String],
    required: false,
  },
});

const eventModel = mongoose.model('events', documentSchema);

module.exports = {
  eventModel
}
