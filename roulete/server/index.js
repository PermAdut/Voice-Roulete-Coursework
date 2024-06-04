const express = require("express");
const mogoose = require("mongoose");
const config = require("config");
const authRouter = require("./routes/authRoutes");
const fileRouter = require("./routes/fileRoutes")
const corsMiddleware = require("./middleware/cors.middleware");
const { Server } = require("socket.io");
const http = require("http");
const https = require("https")
const cors = require("cors");
const { instrument } = require("@socket.io/admin-ui");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(corsMiddleware);
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/files",fileRouter)

const PORT = config.get("serverPort");
const HOSTANAME = config.get("hostname")

const options = {
  key: fs.readFileSync("./ssl/server.key"),
  cert:fs.readFileSync("./ssl/server.crt")
}

const server = https.createServer(options,app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const start = async () => {
  try {
    await mogoose.connect(config.get("dbUrl"));
    server.listen(PORT, HOSTANAME, () => {
      console.log(`HTTPS Server is running on https://${HOSTANAME}:${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

const usersId = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.join(socket.id); 

  socket.on("auth", (userId) => {
    //console.log("auth");
    usersId[socket.id] = {
      id: userId,
      socketId: socket.id,
      connectedSocketId: undefined,
      isConnected: false,
      isSearching: false,
    };
  });

  socket.on("searchForAUser", async (userId) => {
    //console.log("search");
    console.log(usersId);
    if (usersId[socket.id].isSearching || usersId[socket.id].isConnected) {
      return;
    }
    usersId[socket.id].isSearching = true;
    if (usersId[socket.id]) {
      const user = await findUser(usersId[socket.id].id, socket.id);
      if (user) {
        usersId[socket.id].isConnected = true;
        usersId[socket.id].connectedSocketId = user.socketId;
        usersId[socket.id].isSearching = false;
        usersId[user.socketId].isConnected = true;
        usersId[user.socketId].connectedSocketId = socket.id;
        usersId[user.socketId].isSearching = false;
        io.to(socket.id).emit("connection", {
          userID: user.id,
          socketID: user.socketId,
          isSendingOffer: false,
        });
        io.to(user.socketId).emit("connection", {
          userID: usersId[socket.id].id,
          socketID: socket.id,
          isSendingOffer: true,
        });
      } else {
        console.log("Пользователь для соединения не найден.");
      }
    }
  });

  // Пересылаем предложения
  socket.on("offer", (data) => {
    //console.log("offer");
    io.to(data.infoSocket.connectedUserSocketID).emit("offer", {
      type: data.type,
      sdp: data.sdp,
    });
  });

  // Пересылаем кандидатов ICE
  socket.on("candidate", (data) => {
    //console.log("candidate");
    io.to(data.target).emit("candidate", {
      candidate: data.candidate,
      sender: socket.id,
    });
  });

  // Пересылаем ответы
  socket.on("answer", (data) => {
    //console.log("answer");
    io.to(data.infoSocket.connectedUserSocketID).emit("answer", {
      type: data.type,
      sdp: data.sdp,
    });
  });

  socket.on("endCall", (infoSocket) => {
    io.to(infoSocket.socketID).emit("endCall");
    if (infoSocket && usersId[infoSocket.socketID]) {
      const connectedSocketId = infoSocket.connectedUserSocketID;
      if (connectedSocketId && usersId[connectedSocketId]) {
        io.to(connectedSocketId).emit("endCall");
        delete usersId[connectedSocketId];
      }

      delete usersId[socket.id];
    }
  });

  socket.on("disconnect", () => {
    //console.log(`User disconnected: ${socket.id}`);
    if (usersId[socket.id]) {
      const otherSocketId = usersId[socket.id].connectedSocketId;
      if (otherSocketId && usersId[otherSocketId]) {
        io.to(otherSocketId).emit("endCall");
        delete usersId[otherSocketId];
      }
      delete usersId[socket.id];
    }
  });

  async function waitForConnectedUser(users, currentUserId, socketId) {
    while (users[socketId] && users[socketId].isSearching) {
      const connectedUser = await new Promise((resolve) => {
        const connectedUsers = Object.entries(users).filter(
          ([, userInfo]) =>
            String(userInfo.id) !== String(currentUserId) &&
            userInfo.isSearching
        );
        //console.log(connectedUsers);
        if (connectedUsers.length > 0) {
          const randomIndex = Math.floor(Math.random() * connectedUsers.length);
          const [socketId, userInfo] = connectedUsers[randomIndex];
          resolve({ ...userInfo, socketId });
        } else {
          setTimeout(() => resolve(null), 1000);
        }
      });

      if (connectedUser) {
        return connectedUser;
      }
    }
  }

  const findUser = async (currentUserId, socketId) => {
    const user = await waitForConnectedUser(usersId, currentUserId, socketId);
    return user;
  };
});

instrument(io, { auth: false });
start();
