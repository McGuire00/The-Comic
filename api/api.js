const express = require("express");

const artistRouter = require("./artists")
const seriesRouter = require("./series")

const apiRouter = express.Router();

// api/artists/ middleware
apiRouter.use("/artists", artistRouter);

// api/series/ middleware
apiRouter.use("/series", seriesRouter)

module.exports = apiRouter