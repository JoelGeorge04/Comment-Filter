// routes/youtube.js
const express = require('express');
const router = express.Router();
const { getComments } = require('../controllers/youtubeController');

router.get('/comments', getComments);

module.exports = router;
