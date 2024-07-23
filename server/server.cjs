const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: "http://localhost:5173",
     origin: "https://file-transfer-1.onrender.com",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://debmalya017:zmVFDlEDTPIbo9P6@cluster0.htavnrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User model
const User = mongoose.model('User', {
  username: String,
  password: String,
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Register route
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch {
    res.status(500).send('Error registering user');
  }
});

// Login route
app.post('/login', async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user == null) {
    return res.status(400).send('Cannot find user');
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign({ username: user.username }, 'your_jwt_secret');
      res.json({ token: token });
    } else {
      res.send('Not Allowed');
    }
  } catch {
    res.status(500).send('Error logging in');
  }
});

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

const rooms = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('createRoom', ({ roomId, userName }) => {
    console.log(`Creating room ${roomId} for ${userName}`);
    rooms.set(roomId, new Map([[socket.id, userName]]));
    socket.join(roomId);
  });

  // socket.on('joinRoom', ({ roomId, userName }) => {
  //   console.log(`${userName} is joining room ${roomId}`);
  //   if (rooms.has(roomId)) {
  //     rooms.get(roomId).set(socket.id, userName);
  //     socket.join(roomId);
  //     const peerSocketId = Array.from(rooms.get(roomId).keys()).find(id => id !== socket.id);
  //     if (peerSocketId) {
  //       const peerName = rooms.get(roomId).get(peerSocketId);
  //       io.to(peerSocketId).emit('peerConnected', userName);
  //       socket.emit('peerConnected', peerName);
  //     }
  //   } else {
  //     console.log(`Room ${roomId} not found, creating it`);
  //     rooms.set(roomId, new Map([[socket.id, userName]]));
  //     socket.join(roomId);
  //   }
  // });

  socket.on('joinRoom', ({ roomId, userName }) => {
  console.log(`${userName} is joining room ${roomId}`);
  if (rooms.has(roomId)) {
    const existingUsers = Array.from(rooms.get(roomId).values());
    if (existingUsers.includes(userName)) {
      socket.emit('joinError', 'This username is already in the room. Please use a different account.');
      return;
    }
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

app.get('/', (req, res) => {
  res.send('Backend running');
});
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
