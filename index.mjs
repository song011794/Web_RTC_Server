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
    console.log("connection");    
    socket["nickName"] = "User";

    socket.on("message", (message) => {
      const { type, room, payload } = message;

      switch (type) {
        case "nickName":
          socket["nickName"] = payload;
          // io.in(roomNmae).emit("message",  payload);
          break;

        case "newMessage":
          io.in(room).emit("message", `${socket["nickName"]} : ${payload}`);
          break;
      }
    });

    socket.on("join", (data) => {
      // subscriber.subscribe(data.room);

      console.log(data.toString());
      socket.join(data.room);
      socket.to(data.room).emit("joined");
    });

    socket.on("offer", (offer) => {
      const {room, offerData} = offer;
      socket.to(room).emit("offer", offerData);
    });

    socket.on("answer", (answer) => {
      const {room, answerData} = answer;
      socket.to(room).emit("answer", answerData);
    });

    socket.on("ice", (ice) => {
      const {room, iceData} = ice;
      socket.to(room).emit("ice", iceData);
    });

    socket.on("close", () => {
      print("Disconnected");
    });
  });

  server.listen(3000, () => console.log("Server Open!!!"));
}

start();
