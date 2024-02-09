const express = require("express");
const socket = require("socket.io");

const app = express();

app.use(express.static("../client"));

let port = process.env.PORT || 3000;
let server = app.listen(port, () => {
  console.log("Listening to port " + port);
});

let io = socket(server);

// recieve data
io.on("connection", (socket) => {
  console.log("socket connection");
  socket.on("startDrawing", (data) => {
    // transfer data to all connected computers
    io.sockets.emit("startDrawing", data);
  });
  socket.on("continueDrawing", (data) => {
    io.sockets.emit("continueDrawing", data);
  });
  socket.on("undoRedoCanvas", (data) => {
    io.sockets.emit("undoRedoCanvas", data);
  });
});
