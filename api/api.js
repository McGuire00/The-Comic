const express = require("express");

const artistRouter = require("./artists")

const apiRouter = express.Router();

// api/artists/ middleware
apiRouter.use("/artists", artistRouter);

module.exports = apiRouter