import express from "express";
import {
  loginPlayer,
  submitScore,
  getLeaderboard,
} from "../controllers/playerController.js";
import db from "../db.js";

const router = express.Router();

// Login or Register
router.post("/login", loginPlayer);

// Submit Score
router.post("/submit-score", async (req, res) => {
  const { id, score } = req.body;
  const io = req.app.get("io");

  try {
    await db.query("UPDATE players SET score = $1 WHERE id = $2", [score, id]);

    // After update, broadcast to all connected clients
    const { rows } = await db.query(
      "SELECT username, name, score, id FROM players ORDER BY score DESC"
    );
    io.emit("updateLeaderboard", { leaderboard: rows });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update score" });
  }
});

// Get Leaderboard
router.get("/leaderboard", getLeaderboard);
export default router;
