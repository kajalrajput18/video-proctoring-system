require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');

const proctorRoutes = require('./routes/proctor');
const reportRoutes = require('./routes/report');

const app = express();
const server = http.createServer(app);

// ✅ CORS Setup (moved to top)
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://video-proctoring-frontend-81pw6223o.vercel.app',
    'https://video-proctoring-frontend-lrxjayfbt.vercel.app',
    /^https:\/\/video-proctoring-frontend.*\.vercel\.app$/,
    'https://video-proctoring-frontend-81pw6223o-reddyharshavardhans-projects.vercel.app',
    /^https:\/\/.*\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.static('uploads'));

// Socket.io setup with proper CORS
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// ✅ Updated MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/proctoring', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/proctor', proctorRoutes);
app.use('/api/report', reportRoutes);

// Health check routes (keep these)
app.get('/', (req, res) => {
  res.json({ 
    status: 'Video Proctoring Backend is running!',
    endpoints: {
      health: '/health',
      api: '/api',
      startSession: '/api/proctor/start-session'
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Socket.io for real-time events
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('proctoring-event', (data) => {
    // Broadcast to all clients
    io.emit('event-update', data);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { io };