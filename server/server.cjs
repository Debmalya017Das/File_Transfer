const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Replace with your Vite dev server URL
    methods: ["GET", "POST"]
  }
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('createRoom', ({ roomId, userName }) => {
    console.log(`Creating room ${roomId} for ${userName}`);
    rooms.set(roomId, new Map([[socket.id, userName]]));
    socket.join(roomId);
  });

  socket.on('joinRoom', ({ roomId, userName }) => {
    console.log(`${userName} is joining room ${roomId}`);
    if (rooms.has(roomId)) {
      rooms.get(roomId).set(socket.id, userName);
      socket.join(roomId);
      const peerSocketId = Array.from(rooms.get(roomId).keys()).find(id => id !== socket.id);
      if (peerSocketId) {
        const peerName = rooms.get(roomId).get(peerSocketId);
        io.to(peerSocketId).emit('peerConnected', userName);
        socket.emit('peerConnected', peerName);
      }
    } else {
      console.log(`Room ${roomId} not found, creating it`);
      rooms.set(roomId, new Map([[socket.id, userName]]));
      socket.join(roomId);
    }
  });

  socket.on('sendFile', ({ roomId, fileName, data }) => {
    socket.to(roomId).emit('receiveFile', { fileName, data });
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    rooms.forEach((peers, roomId) => {
      if (peers.has(socket.id)) {
        peers.delete(socket.id);
        if (peers.size === 0) {
          rooms.delete(roomId);
        } else {
          const peerSocketId = Array.from(peers.keys())[0];
          io.to(peerSocketId).emit('peerDisconnected');
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});