import { Router } from "express";

import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
  addMovie,
  deleteMovie,
  getWatchlist,
  updateMovie,
} from "../utils/db.js";

const router = Router();

router.use(authenticate);

router.get("/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  const watchlist = getWatchlist(userId);
  if (watchlist === null) {
    return res.status(404).json({ error: "User not found." });
  }

  res.json(watchlist);
});

router.post("/:userId/movies", authorizeModification, (req, res) => {
  const movie = addMovie(Number(req.params.userId), req.body);
  if (movie === null) {
    return res.status(404).json({ error: "User not found." });
  }

  res.status(201).json(movie);
});

router.put("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const movie = updateMovie(
    Number(req.params.userId),
    Number(req.params.movieId),
    req.body,
  );
  if (movie === null) {
    return res.status(404).json({ error: "Movie not found." });
  }

  res.json(movie);
});

router.delete("/:userId/movies/:movieId", authorizeModification, (req, res) => {
  const deleted = deleteMovie(
    Number(req.params.userId),
    Number(req.params.movieId),
  );
  if (deleted === null) {
    return res.status(404).json({ error: "Movie not found." });
  }

  res.json({ message: "Movie deleted successfully." });
});

export default router;