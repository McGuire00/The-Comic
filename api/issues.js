const express = require("express");
const sqlite3 = require("sqlite3");

const databaseConnection = process.env.TEST_DATABASE || "./database.sqlite";
const db = new sqlite3.Database(databaseConnection);

const issuesRouter = express.Router({ mergeParams: true });

issuesRouter.get("/", (req, res, next) => {
  const sql = `SELECT * FROM Issue WHERE Issue.series_id = $seriesId`;
  const values = { $seriesId: req.params.seriesId };
  db.all(sql, values, (err, issues) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({ issues: issues });
    }
  });
});

issuesRouter.post("/", (req, res, next) => {
  const name = req.body.issue.name;
  const issueNumber = req.body.issue.issueNumber;
  const publicationDate = req.body.issue.publicationDate;
  
  const artistId = req.body.issue.artistId;
  const artistSql = "SELECT * FROM Artist WHERE Artist.id = $artistId";
  const artistValues = {
    $artistId: artistId,
  };

  db.get(artistSql, artistValues, (error, artist) => {
    if (error) {
      next(error);
    } else {
      if (!name || !issueNumber || !publicationDate || !artist) {
        return res.sendStatus(400);
      }

      const sql =
        "INSERT INTO Issue (name, issue_number, publication_date, artist_id, series_id) VALUES ($name, $issueNumber, $publicationDate, $artistId, $seriesId)";
      const values = {
        $name: name,
        $issueNumber: issueNumber,
        $publicationDate: publicationDate,
        $artistId: artistId,
        $seriesId: req.params.seriesId,
      };
      db.run(sql, values, function (error) {
        if (error) {
          next(error);
        } else {
          db.get(
            `SELECT * FROM Issue WHERE Issue.id = ${this.lastID}`,
            (error, issue) => {
              res.status(201).json({ issue: issue });
            }
          );
        }
      });
    }
  });
});

module.exports = issuesRouter;
