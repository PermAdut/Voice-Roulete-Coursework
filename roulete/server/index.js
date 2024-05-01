const express = require("express");
const mogoose = require("mongoose");
const config = require("config");
const authRouter = require("./routes/authRoutes");
const corsMiddleware = require("./middleware/cors.middleware");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(corsMiddleware);
app.use(express.json());
app.use("/api/auth", authRouter);

const PORT = config.get("serverPort");
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const start = async () => {
  try {
    await mogoose.connect(config.get("dbUrl"));

    server.listen(PORT, () => console.log("server is running"));
  } catch (e) {
    console.log(e);
  }
};

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  socket.on("audioMessage", (audioData) => {
    console.log(audioData);
    socket.emit("audioMessage", audioData);
  });
});

start();
