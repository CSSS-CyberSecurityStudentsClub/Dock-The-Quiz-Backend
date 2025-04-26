import pool from "../db/index.js";

export const loginPlayer = async (req, res) => {
  const { username, name, phone, college } = req.body;

  if (!username || !name || !phone || !college) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const client = await pool.connect();

    const existing = await client.query(
      "SELECT * FROM players WHERE username = $1",
      [username]
    );

    if (existing.rows.length > 0) {
      client.release();
      return res.json({ message: "Welcome back!", player: existing.rows[0] });
    }

    const newPlayer = await client.query(
      "INSERT INTO players (username, name, phone, college) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, name, phone, college]
    );

    client.release();
    res.json({ message: "Player registered!", player: newPlayer.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database Error" });
  }
};

export const submitScore = async (req, res) => {
  const { id, score } = req.body;

  if (!id || score === undefined) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const client = await pool.connect();

    const updated = await client.query(
      "UPDATE players SET score = $1 WHERE id = $2 RETURNING *",
      [score, id]
    );

    client.release();
    res.json({ message: "Score Updated!", player: updated.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database Error" });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const client = await pool.connect();

    const result = await client.query(
      "SELECT username, name, score FROM players ORDER BY score DESC LIMIT 20"
    );

    client.release();
    res.json({ leaderboard: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database Error" });
  }
};
