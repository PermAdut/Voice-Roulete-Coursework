const express = require("express");
const mogoose = require("mongoose");
const config = require("config");
const authRouter = require("./routes/authRoutes");
const corsMiddleware = require("./middleware/cors.middleware");
const { Server } = require("socket.io");
const http = require("http");
const cors = require("cors");
const { instrument } = require("@socket.io/admin-ui");
const fs = require('fs');

const app = express();
app.use(cors());
app.use(corsMiddleware);
app.use(express.json());
app.use("/api/auth", authRouter);

const httpsOptions = {
  key: fs.readFileSync('./openssl/server.key'),
  cert: fs.readFileSync('./openssl/cert.pem')
};

const PORT = config.get("serverPort");
const server = http.createServer(httpsOptions,app);
const io = new Server(server, {
  cors: {
    //origin: ["http://localhost:3000","http://192.168.0.114:3000", "https://admin.socket.io"],
    origin:"*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});



const start = async () => {
  try {
    await mogoose.connect(config.get("dbUrl"));

    server.listen(PORT,"192.168.0.114", () => console.log("server is running"));
  } catch (e) {
    console.log(e);
  }
};

const usersId = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.join(socket.id);

  socket.on("auth", (userId) => {
    usersId[socket.id] = {
      id: userId,
      socketId: socket.id,
      isConnected: false,
    };
    // io.to(socket.id).emit('lol') // eto letit k clienty, a ot clienta emits letyat na server
  });

  socket.on("searchForAUser", async (userId) => {
    if (!usersId[socket.id].isConnected) {
      console.log("search");
      const user = await findUser(usersId[socket.id].id);
      if (user) {
        console.log(usersId);
        usersId[socket.id].isConnected = true;
        usersId[user.socketId].isConnected = true;
        io.to(socket.id).emit("connection",{userID:user.id, socketID:user.socketId, isSendingOffer:false})
        io.to(user.socketId).emit("connection",{userID:usersId[socket.id].id, socketID:socket.id, isSendingOffer:true})
      } else {
        console.log("Пользователь для соединения не найден.");
      }
    }
  });

  // Пересылаем предложения
  socket.on("offer", (data) => {
    io.to(data.infoSocket.connectedUserSocketID).emit('offer', {type:data.type, sdp:data.sdp})
  });

  // Пересылаем кандидатов ICE
  socket.on("candidate", (data) => {
    console.log('CANDATE TO', data.target)
    io.to(data.target).emit("candidate", {
      candidate: data.candidate,
      sender: socket.id,
    });
  });

  // Пересылаем ответы
  socket.on("answer", (data) => {
    io.to(data.infoSocket.connectedUserSocketID).emit("answer", {type:data.type, sdp: data.sdp });
  });

  socket.on("disconnect", () => {
    if (socket.id in usersId) {
      delete usersId[socket.id];
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

async function waitForConnectedUser(users, currentUserId) {
  while (true) {
    const connectedUser = await new Promise((resolve) => {
      const connectedUsers = Object.entries(users).filter(
        ([, userInfo]) => userInfo.id !== currentUserId && !userInfo.isConnected
      );
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

const findUser = async (currentUserId) => {
  const user = await waitForConnectedUser(usersId, currentUserId);
  return user;
};

instrument(io, { auth: false });
start();
