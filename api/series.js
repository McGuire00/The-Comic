const express = require("express");
const sqlite3 = require("sqlite3");

const databaseConnection = process.env.TEST_DATABASE || "./database.sqlite";
const db = new sqlite3.Database(databaseConnection);

const seriesRouter = express.Router();

seriesRouter.param("seriesId", (req, res, next, seriesId) => {
  const sql = "SELECT * FROM Series WHERE Series.id = $seriesId";
  const values = { $seriesId: seriesId };
  db.get(sql, values, (error, series) => {
    if (error) {
      next(error);
    } else if (series) {
      req.series = series;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

seriesRouter.get("/", (req, res, next) => {
  db.all("SELECT * FROM Series", (err, series) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({ series: series });
    }
  });
});

seriesRouter.post("/", (req, res, next) => {
  const name = req.body.name;
  const description = req.body.description;

  if (!name || !description) {
    return res.sendStatus(400);
  }
  const sql =
    "INSERT INTO Series (name, description) VALUES ($name, $description)";
  const values = {
    $name: name,
    $description: description,
  };

  db.run(sql, values, function (error) {
    if (error) {
      next(error);
    } else {
      db.get(
        `SELECT * FROM Series WHERE Series.id = ${this.lastID}`,
        (error, series) => {
          res.status(201).json({ series: series });
        }
      );
    }
  });
});

seriesRouter.get("/:seriesId", (req, res, next) => {
  res.status(200).json({ series: req.series });
});

module.exports = seriesRouter;
