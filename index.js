import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import playerRoutes from "./routes/playerRoutes.js";

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://dock-the-quiz.vercel.app", "http://localhost:5173"], // ✅ Your frontend and localhost
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: ["https://dock-the-quiz.vercel.app", "http://localhost:5173"],
  })
);
app.use(express.json());

// API Routes
app.use("/api", playerRoutes);

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("New client connected ⚡");

  socket.on("disconnect", () => {
    console.log("Client disconnected ❌");
  });
});

// Make io available to routes
app.set("io", io);

// Test Route
app.get("/", (req, res) => {
  res.send("Dock the Flag Backend Running! 🛡️");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
