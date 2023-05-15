import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();

async function start() {
  const server = http.createServer(app);

  const io = new Server(server, {
    transports: ["websocket"],
  });

  // const roomNmae = "dogRoom";

  io.on("connection", (socket) => {
    console.log(`Connection : ${socket.id}`);

    socket["nickName"] = "User";

    socket.on("message", (message) => {
      const { type, payload, room } = message;

      switch (type) {
        case "nickName":
          socket["nickName"] = payload.length == 0 ? "User" : payload;
          // io.in(roomNmae).emit("message",  payload);
          break;

        case "newMessage":
          console.log(`${socket["nickName"]} : ${payload}`);
          socket.to(room).emit("message", {
            nickName: socket["nickName"],
            payload: payload,
          });
          break;
      }
    });

    socket.on("join", (data) => {
      const { room } = data;
      console.log(`Join Room : ${room}`);

      socket.join(room);
      socket.to(room).emit("joined");
    });

    socket.on("offer", (offer) => {
      const { room, offerData } = offer;
      console.log(`offer!!!! Room : ${room}`);

      socket.to(room).emit("offer", offerData);
      // io.to(room).emit("offer", offerData);
    });

    socket.on("answer", (answer) => {
      const { room, answerData } = answer;
      console.log(`offer!!!! Room : ${room} , Answer : ${answer.toString()}`);
      socket.to(room).emit("answer", answerData);
      // io.to(room).emit("answer", answerData);
    });

    socket.on("ice", (ice) => {
      const { room, iceData } = ice;
      console.log(`ice!!!! Room : ${room}`);

      socket.to(room).emit("ice", iceData);
      // io.to(room).emit("ice", iceData);
      // socket.emit('ice', iceData);
    });

    socket.on("close", () => {
      print("Disconnected");
    });
  });

  server.listen(3000, () => console.log("Server Open!!!"));
}

start();
