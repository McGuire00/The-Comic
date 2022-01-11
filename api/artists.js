const express = require("express");
const sqlite3 = require("sqlite3");

const databaseConnection = process.env.TEST_DATABASE || "./database.sqlite";
const db = new sqlite3.Database(databaseConnection);

// api/artist/
const artistRouter = express.Router();

artistRouter.param("artistId", (req, res, next, artistId) => {
    const sql = "SELECT * FROM Artist WHERE Artist.id = $artistId";
    const values = { $artistId: artistId };
    db.get(sql, values, (error, artist) => {
        if (error) {
          next(error);
        } else if (artist) {
          req.artist = artist;
          next();
        } else {
          res.sendStatus(404);
        }
    });
});

artistRouter.get("/", (req, res, next) => {
  db.all(
    "SELECT * FROM Artist WHERE Artist.is_currently_employed = 1",
    (err, artists) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({ artists: artists });
      }
    }
  );
});

artistRouter.get("/:artistId", (req, res, next) => {
    res.status(200).json({artist: req.artist})
});

module.exports = artistRouter;
