const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { sequelize, Message } = require('./models');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes'); // We'll create this next
const configRoutes = require('./routes/configRoutes'); // And this
const userRoutes = require('./routes/userRoutes'); // And this
const axios = require('axios');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for dev
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/config', configRoutes);
app.use('/api/users', userRoutes);

// Quote Proxy
app.get('/api/quote', async (req, res) => {
  try {
    const response = await axios.get('https://zenquotes.io/api/random');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quote' });
  }
});

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Socket ${socket.id} joined user_${userId}`);
  });

  socket.on('send_message', async (data) => {
    // data: { senderId, receiverId, content, type, fileUrl }
    try {
      const msg = await Message.create({
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        type: data.type,
        fileUrl: data.fileUrl
      });
      
      // Emit to receiver
      io.to(`user_${data.receiverId}`).emit('receive_message', msg);
      // Emit back to sender (so they see it confirmed)
      io.to(`user_${data.senderId}`).emit('receive_message', msg);
    } catch (err) {
      console.error('Socket message error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
