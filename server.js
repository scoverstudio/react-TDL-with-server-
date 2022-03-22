const express = require("express");
const path = require("path");
const cors = require("cors");
const socket = require("socket.io");

const app = express();

const tasks = [];

app.use(express.static(path.join(__dirname, "/client")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use((req, res) => {
  if (res.status(404)) {
    res.json({ message: "Not found..." });
  }
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log("Your server is running on port: 8000");
});

const io = socket(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("New client! Its id – " + socket.id);
  socket.emit("updateData", tasks);

  socket.on("addTask", (task) => {
    tasks.push(task);
    socket.broadcast.emit("addTask", task);
  });
  socket.on("removeTask", (index) => {
    tasks.splice(index, 1);
    socket.broadcast.emit("removeTask", index);
  });
});
