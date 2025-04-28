import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import playerRoutes from "./routes/playerRoutes.js";

dotenv.config();

const app = express();
const server = createServer(app);

// ✨ FIXED: Proper Socket.io CORS
const io = new Server(server, {
  cors: {
    origin: "https://dock-the-quiz.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

// ✨ FIXED: Proper Express CORS too
app.use(
  cors({
    origin: "https://dock-the-quiz.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// API Routes
app.use("/api", playerRoutes);

// Attach io to app
app.set("io", io);

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("⚡ New client connected!");

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

// Test Route
app.get("/", (req, res) => {
  res.send("Dock the Flag Backend Running! 🛡️");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
