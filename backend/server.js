const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const proctorRoutes = require('./routes/proctor');
const reportRoutes = require('./routes/report');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
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

// Socket.io for real-time events
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('proctoring-event', (data) => {
    // Broadcast to all connected clients
    io.emit('event-update', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://video-proctoring-frontend-81pw6223o.vercel.app',
    'https://video-proctoring-frontend-lrxjayfbt.vercel.app',
    /^https:\/\/video-proctoring-frontend.*\.vercel\.app$/,
    'https://video-proctoring-frontend-81pw6223o-reddyharshavardhans-projects.vercel.app',
    /^https:\/\/.*\.vercel\.app$/  // Allow all Vercel preview URLs
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Also add preflight handling
app.options('*', cors(corsOptions));

// Add this BEFORE your other routes
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

module.exports = { io };