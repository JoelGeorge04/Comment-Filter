import { useState } from "react";
import axios from "axios";

export default function App() {
  const [videoURL, setVideoURL] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = async () => {
    if (!videoURL.trim()) {
      setError("Please enter a valid video URL.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axios.get("/api/youtube/comments", {
        params: { videoUrl: videoURL },
      });
      setComments(response.data.comments || []);
    } catch (err) {
      setError("Failed to fetch comments. Check console for details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
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
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#005bb5")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#0073e6")}
          >
            {loading ? "Loading..." : "Fetch Comments"}
          </button>
        </div>

        {error && (
          <p style={{ color: "red", textAlign: "center", marginBottom: "20px" }}>
            {error}
          </p>
        )}

        <div>
          <h3 style={{ marginBottom: "15px", fontSize: "24px", color: "#333" }}>
            Comments:
          </h3>
          <div
            style={{
              maxHeight: "500px",
              overflowY: "auto",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "16px",
              backgroundColor: "#fafafa",
            }}
          >
            {comments.length === 0 ? (
              <p style={{ color: "#666", fontSize: "16px" }}>
                No comments to display.
              </p>
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
                    <div style={{ marginBottom: "8px", fontWeight: "600", color: "#0073e6" }}>
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
                      ♡  {comment.likeCount || 0} {comment.likeCount === 1 ? 'like' : 'likes'}
                    </div>
                  </li>
                ))}
              </ul>


            )}
          </div>
        </div>
      </div>
    </div>
  );
}
