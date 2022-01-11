require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const errorHandler = require("errorhandler");
const morgan = require("morgan");

const apiRouter = require("./api/api");

// instance of express app
const app = express();

// body parser middleware
app.use(bodyParser.json());

// cors middleware
app.use(cors());

// error handler
app.use(errorHandler());

// api/ middleware
app.use("/api", apiRouter);

// PORT
const port = process.env.PORT || 3000;

// listen to server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// export for use in test file
module.exports = app;
