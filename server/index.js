require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const redis = require('./redisClient');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();

// Enable CORS for your frontend URL
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/online_learning', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Import Course model
const Course = require('./models/course');

// Root endpoint
app.get('/', (req, res) => {
  res.send('API is running');
});

// Get all courses
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json({ success: true, data: courses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Set and get number of live participants in a class
app.post('/api/live-class/:sessionId/join', async (req, res) => {
  const { sessionId } = req.params;
  await redis.incr(`live:${sessionId}:participants`);
  const count = await redis.get(`live:${sessionId}:participants`);
  res.json({ success: true, participants: Number(count) });
});

app.get('/api/live-class/:sessionId/participants', async (req, res) => {
  const { sessionId } = req.params;
  const count = await redis.get(`live:${sessionId}:participants`);
  res.json({ success: true, participants: Number(count || 0) });
});


app.use('/api/auth', authRoutes);

// Example protected route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ msg: `Welcome user ${req.user.id}` });
});

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));