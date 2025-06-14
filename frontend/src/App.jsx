import { useState } from "react";
import axios from "axios";
import SentimentPieChart from '../src/componenets/SentimentPieChart';

const spinnerStyle = {
  border: "4px solid #f3f3f3",
  borderTop: "4px solid #28a745", 
  borderRadius: "50%",
  width: "24px",
  height: "24px",
  animation: "spin 1s linear infinite",
  marginLeft: "10px",
};

const spinnerKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

export default function App() {
  const [videoURL, setVideoURL] = useState("");
  const [comments, setComments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [positiveComments, setPositiveComments] = useState([]);
  const [negativeComments, setNegativeComments] = useState([]);
  const [filtering, setFiltering] = useState(false);

  const fetchComments = async () => {
    if (!videoURL.trim()) {
      setError("Please enter a valid video URL.");
      return;
    }
    setError("");
    setLoading(true);
    setPositiveComments([]);
    setNegativeComments([]);

    try {
      const response = await axios.get("/api/youtube/comments", {
        params: { videoUrl: videoURL },
      });
      setComments(response.data.comments || []);
      setTotalCount(response.data.totalCommentCount || 0);
    } catch (err) {
      setError("Failed to fetch comments. Check console for details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filterComments = async () => {
    if (comments.length === 0) {
      setError("No comments to filter. Please fetch comments first.");
      return;
    }

    setError("");
    setFiltering(true);

    const pos = [];
    const neg = [];

    for (const comment of comments) {
      try {
        const response = await axios.post("http://localhost:5001/analyze", {
          text: comment.text,
        });
        if (response.data.label === "POSITIVE") {
          pos.push(comment);
        } else if (response.data.label === "NEGATIVE") {
          neg.push(comment);
        }
      } catch (err) {
        console.error("Error analyzing comment:", err);
      }
    }

    setPositiveComments(pos);
    setNegativeComments(neg);
    setFiltering(false);
  };

  return (
    <>
      {/* Inject spinner keyframes into document */}
      <style>{spinnerKeyframes}</style>

      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          padding: "60px 40px",
          boxSizing: "border-box",
          background: "#eef1f6",
          fontFamily: "'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "12px",
            boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h1
            style={{
              fontSize: "36px",
              marginBottom: "30px",
              color: "#0073e6",
              textAlign: "center",
            }}
          >
            YouTube Comments Fetcher
          </h1>

          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "30px",
            }}
          >
            <input
              type="text"
              placeholder="Paste YouTube video URL here"
              value={videoURL}
              onChange={(e) => setVideoURL(e.target.value)}
              style={{
                flex: "1 1 600px",
                padding: "14px",
                fontSize: "18px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outlineColor: "#0073e6",
              }}
            />
            <button
              onClick={fetchComments}
              style={{
                padding: "14px 28px",
                fontSize: "18px",
                backgroundColor: "#0073e6",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background 0.3s",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "10px"
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#005bb5")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#0073e6")}
              disabled={loading}
            >
              {loading ? "Fetching..." : "Fetch Comments"}
              {loading && <div style={spinnerStyle} />}
            </button>
            <button
              onClick={filterComments}
              style={{
                padding: "14px 28px",
                fontSize: "18px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background 0.3s",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1e7e34")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
              disabled={filtering}
            >
              {filtering ? "Filtering..." : "Filter Comments"}
              {filtering && <div style={spinnerStyle} />}
            </button>
          </div>

          {error && (
            <p
              style={{ color: "red", textAlign: "center", marginBottom: "20px" }}
            >
              {error}
            </p>
          )}

          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
              fontSize: "18px",
              color: "#333",
            }}
          >
            Total Comments on YouTube: <strong>{totalCount}</strong>
            <br />
            {positiveComments.length === 0 && negativeComments.length === 0 ? (
              <>Fetched: {comments.length}</>
            ) : (
              <>
                Positive: {positiveComments.length} | Negative:{" "}
                {negativeComments.length} | Fetched:{" "}
                {positiveComments.length + negativeComments.length}
              </>
            )}
          </div>

          {(positiveComments.length > 0 || negativeComments.length > 0) && (
            <div style={{ maxWidth: 400, margin: "0 auto 30px" }}>
              <SentimentPieChart
                positive={positiveComments.length}
                negative={negativeComments.length}
              />
            </div>
          )}

          {positiveComments.length === 0 && negativeComments.length === 0 ? (
            <CommentsList title="Comments" comments={comments} />
          ) : (
            <div
              style={{
                display: "flex",
                gap: "30px",
                justifyContent: "space-between",
                flexWrap: "wrap",
                marginTop: "30px",
              }}
            >
              <div style={{ flex: "1 1 48%" }}>
                <CommentsList
                  title="Positive Comments"
                  comments={positiveComments}
                  color="blue"
                />
              </div>
              <div style={{ flex: "1 1 48%" }}>
                <CommentsList
                  title="Negative Comments"
                  comments={negativeComments}
                  color="red"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function CommentsList({ title, comments, color = "gray" }) {
  const borderColor =
    color === "blue" ? "#0073e6" : color === "red" ? "#e63946" : "#ccc";
  const titleColor = color === "blue" ? "#0073e6" : color === "red" ? "#e63946" : "#333";

  return (
    <div>
      <h3 style={{ marginBottom: "15px", fontSize: "24px", color: titleColor }}>
        {title}:
      </h3>
      <div
        style={{
          maxHeight: "400px",
          overflowY: "auto",
          border: `2px solid ${borderColor}`,
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#fafafa",
        }}
      >
        {comments.length === 0 ? (
          <p style={{ color: "#666", fontSize: "16px" }}>No comments to display.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {comments.map((comment, i) => (
              <li
                key={i}
                style={{
                  marginBottom: "16px",
                  padding: "14px",
                  background: "#fff",
                  borderRadius: "6px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  fontSize: "16px",
                  color: "#333",
                }}
              >
                <div style={{ marginBottom: "8px", fontWeight: "600", color: titleColor }}>
                  {comment.authorName}
                </div>

                <div
                  dangerouslySetInnerHTML={{ __html: comment.text }}
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    marginBottom: "6px",
                  }}
                ></div>

                <div style={{ fontSize: "14px", color: "#888" }}>
                  ♡ {comment.likeCount || 0} {comment.likeCount === 1 ? "like" : "likes"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
