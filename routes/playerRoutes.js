import express from "express";
import {
  loginPlayer,
  submitScore,
  getLeaderboard,
} from "../controllers/playerController.js";

const router = express.Router();

// Login or Register
router.post("/login", loginPlayer);

// Submit Score
router.post("/submit-score", submitScore);

// Get Leaderboard
router.get("/leaderboard", getLeaderboard);
export default router;
