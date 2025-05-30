const express = require('express');
const axios = require('axios');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const YT_API_KEY = process.env.YT_API_KEY;

router.get('/comments', async (req, res) => {
  const { videoUrl } = req.query;

  if (!videoUrl) {
    return res.status(400).json({ error: 'Missing videoUrl query parameter' });
  }

  try {
    let videoId;
    const parsedUrl = new URL(videoUrl);
    if (parsedUrl.hostname === 'youtu.be') {
      videoId = parsedUrl.pathname.slice(1);
    } else {
      videoId = parsedUrl.searchParams.get('v');
    }

    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube video URL' });
    }

    const ytApiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${YT_API_KEY}&maxResults=50`;

    const response = await axios.get(ytApiUrl);

    const comments = response.data.items.map(item => {
      const snippet = item.snippet.topLevelComment.snippet;
      return {
        authorName: snippet.authorDisplayName,
        text: snippet.textDisplay,
        likeCount: snippet.likeCount
      };
    });

    res.json({ comments });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch YouTube comments' });
  }
});

module.exports = router;
