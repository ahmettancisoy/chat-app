require("dotenv").config();
const express = require("express");
const app = express();
var cors = require("cors");
app.use(cors({ origin: process.env.APP_URL, credentials: true }));
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const root = require("./routes/root");
const chatRoutes = require("./routes/chatRoutes");
const profileRoutes = require("./routes/profileRoutes");
const errorHandler = require("./middleware/errorHandler");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.APP_URL,
    credentials: true,
  },
});

connectDB();

app.use(express.static("public"));

app.use(express.json());
app.use(cookieParser());

app.use("/", root);
app.use("/", chatRoutes);
app.use("/", profileRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

io.on("connection", async (socket) => {
  console.log("a user connected");

  socket.on("setup", (uid) => {
    socket.name = uid;
    socket.join(uid);
    socket.emit("connected");
  });

  socket.on("new conversation", (newConversationReceived, fromId) => {
    newConversationReceived.participants.forEach((participant) => {
      if (participant._id !== fromId) {
        socket
          .to(participant._id)
          .emit("conversation received", newConversationReceived);
      }
    });
  });

  socket.on("join conversation", (conversationId, prevConvId) => {
    if (prevConvId !== "" && prevConvId !== undefined && prevConvId !== null)
      socket.leave(prevConvId);

    socket.join(conversationId);
    console.log(`user joined to room: ${conversationId}`);
  });

  socket.on("new message", (newMessageReceived) => {
    const conversation = newMessageReceived.conversation;
    if (!conversation.participants)
      return console.log("participants not defined");

    if (conversation._id !== undefined) {
      const socketNames = getSocketNames(conversation._id);

      const notification = {
        id: conversation._id,
        text: newMessageReceived.text,
      };

      conversation.participants.forEach((participant) => {
        if (participant !== newMessageReceived.sender._id) {
          if (socketNames.includes(participant)) {
            socket
              .in(conversation._id)
              .emit("message received", newMessageReceived);
            notification.isActive = true;
          } else {
            notification.isActive = false;
          }
          socket.to(participant).emit("notification", notification);
        }
      });
    }
  });

  socket.on("typing", (conversationId) =>
    socket.in(conversationId).emit("typing")
  );
  socket.on("stop typing", (conversationId) =>
    socket.in(conversationId).emit("stop typing")
  );

  //Get socket names
  const getSocketNames = (roomName) => {
    const socketsInRoom = io.sockets.adapter.rooms.get(roomName);
    const socketIdsArray = Array.from(socketsInRoom);
    const socketNamesInRoom = socketIdsArray.map((socketId) => {
      const socket = io.sockets.sockets.get(socketId);
      return socket.name;
    });

    return socketNamesInRoom;
  };
});
