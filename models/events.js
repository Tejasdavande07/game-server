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
  
  module.exports = mongoose.model('events', documentSchema);
