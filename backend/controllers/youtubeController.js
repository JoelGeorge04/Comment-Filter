const axios = require('axios');
require('dotenv').config();

const YT_API_KEY = process.env.YT_API_KEY;

// Sentiment analysis function
const analyzeSentiment = async (commentText) => {
  try {
    const response = await axios.post('http://localhost:5001/analyze', {
      text: commentText,
    });
    return response.data;
  } catch (error) {
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

    // Step 1: Fetch total comment count
    const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${YT_API_KEY}`;
    const statsResponse = await axios.get(statsUrl);
    const totalCommentCount = statsResponse.data.items[0]?.statistics?.commentCount || 0;

    // Step 2: Paginate and collect comments
    const maxCommentsToFetch = 500; // for number of cmts to fetch
    let nextPageToken = null;
    let allComments = [];

    do {
      const ytApiUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${YT_API_KEY}&maxResults=100${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
      const response = await axios.get(ytApiUrl);

      const fetchedComments = response.data.items.map(item => {
        const snippet = item.snippet.topLevelComment.snippet;
        return {
          authorName: snippet.authorDisplayName,
          text: snippet.textDisplay,
          likeCount: snippet.likeCount,
        };
      });

      allComments.push(...fetchedComments);

      nextPageToken = response.data.nextPageToken;
    } while (nextPageToken && allComments.length < maxCommentsToFetch);

    // Step 3: Analyze sentiment
    const analyzedComments = await Promise.all(
      allComments.slice(0, maxCommentsToFetch).map(async (comment) => {
        const sentiment = await analyzeSentiment(comment.text);
        return {
          ...comment,
          sentiment: sentiment.label,
          confidence: sentiment.score.toFixed(2),
        };
      })
    );

    // Step 4: Return results
    res.json({
      comments: analyzedComments,
      totalCommentCount,
      fetchedCount: analyzedComments.length,
    });

  } catch (error) {
    console.error('YouTube comment fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch YouTube comments' });
  }
};
