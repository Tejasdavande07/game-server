const express = require("express");
const apiRouter = express.Router();
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

const Document = mongoose.model("Document", documentSchema);

apiRouter.get("/", (req, res) => {
  res.status(200).json({ message: "game" });
});

apiRouter.post("/event", async (req, res) => {
  const newDocument = new Document(req.body);
  const savedDocument = await newDocument.save();
  res.status(201).send(savedDocument);
});

module.exports = apiRouter;
