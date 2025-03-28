require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

console.log("👉 MONGO_URI:", process.env.MONGO_URI); // Debug URI log

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1); // Exit process on error
});

// Add a test route
app.get('/', (req, res) => {
  res.send('✅ Backend is running...');
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
