const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const youtubeRoutes = require('./routes/youtube');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/youtube', youtubeRoutes);

// demo route
app.get('/', (req, res) => {
  res.send('YouTube Comment Fetcher API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running ${PORT}`);
});
