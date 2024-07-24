const express = require("express");
const apiRouter = express.Router();


const Document = require('../models/events'); 

apiRouter.get("/", (req, res) => {
  res.status(200).json({ message: "game" });
});

apiRouter.post("/event", async (req, res) => {
  const newDocument = new Document(req.body);
  const savedDocument = await newDocument.save();
  res.status(201).send(savedDocument);
});

module.exports = apiRouter;
