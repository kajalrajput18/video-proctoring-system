const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://admin:ETIXUQSEufRFfvYN@cluster-video-proctorin.no3xuey.mongodb.net/video-proctoring?retryWrites=true&w=majority&appName=Cluster0';

console.log('Testing MongoDB connection...');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
}).then(() => {
  console.log('✅ Connected to MongoDB successfully!');
  process.exit(0);
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  console.error('Full error:', err);
  process.exit(1);
});
