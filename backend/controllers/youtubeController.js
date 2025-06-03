// controllers/youtubeController.js
const axios = require('axios');
require('dotenv').config();

const YT_API_KEY = process.env.YT_API_KEY;

// Function to send comment to ML microservice for sentiment analysis
const analyzeSentiment = async (commentText) => {
  try {
    const response = await axios.post('http://localhost:5001/analyze', {
      text: commentText,
    });
    return response.data;
  } catch (error) {
    // Log the full error for better debugging:
    console.error('Sentiment analysis error:', error.response ? error.response.data : error.message || error);
    return { label: 'UNKNOWN', score: 0 };
  }
};


exports.getComments = async (req, res) => {
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

    const ytApiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${YT_API_KEY}&maxResults=90`;

    const response = await axios.get(ytApiUrl);

    // Analyze sentiment for each comment
    const comments = await Promise.all(
      response.data.items.map(async (item) => {
        const snippet = item.snippet.topLevelComment.snippet;
        const sentiment = await analyzeSentiment(snippet.textDisplay);

        return {
          authorName: snippet.authorDisplayName,
          text: snippet.textDisplay,
          likeCount: snippet.likeCount,
          sentiment: sentiment.label,
          confidence: sentiment.score.toFixed(2),
        };
      })
    );

    res.json({ comments });
  } catch (error) {
    console.error('YouTube comment fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch YouTube comments' });
  }
};
