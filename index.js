import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import playerRoutes from "./routes/playerRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
const allowedOrigins = [
  // "http://localhost:5173",
  "https://dock-the-quiz.vercel.app",
];
app.use(
  cors({
    origin: "https://dock-the-quiz.vercel.app", // Change when deploying
  })
);

app.use(express.json());

// API Routes
app.use("/api", playerRoutes);

app.get("/", (req, res) => {
  res.send("Dock the Flag Backend Running! 🛡️");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
