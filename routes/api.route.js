const express = require("express");
const apiRouter = express.Router();

apiRouter.get("/", (req, res) => {
  res.status(200).json({ message: "Powered by InkInCaps" });
});

module.exports = apiRouter
