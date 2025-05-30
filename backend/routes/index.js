const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const youtubeRoutes = require('./routes/youtube');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/youtube', youtubeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
