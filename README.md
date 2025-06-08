#  YouTube Comments Fetcher + Sentiment Analysis (ML)

This full-stack app lets you fetch comments from any YouTube video and classify them as **positive** or **negative** using machine learning. Built using **React**, **Express**, and the **YouTube Data API**, it enhances understanding of audience engagement.

---

##  Features

-  Paste a YouTube video URL and fetch top-level comments
-  Display:
  - Commenter's name
  - Comment text
  - Like count
-  Highlight sentiment: **Positive / Negative** using ML
-  Handles both full and short YouTube URLs (`youtu.be`)
-  Responsive and beautiful frontend
-  Filters and displays sentiment-based statistics (optional)

---

##  Machine Learning Integration

A trained ML model (e.g. **SVM**, **Naive Bayes**) is used to classify each comment into:

-  **Positive**
-  **Negative**

> Comments are processed using **TF-IDF vectorization** and a classifier is trained using labeled datasets of user comments.

You can extend this feature by:
- Visualizing results (e.g., sentiment pie chart)
- Filtering by sentiment type
- Storing training data or results in MongoDB/PostgreSQL

---

##  Tech Stack

- **Frontend**: React + Axios
- **Backend**: Express.js + Node.js
- **ML**: Python (scikit-learn or similar)
- **API**: YouTube Data API v3
- **Optional**: Flask (for ML inference as microservice)

---
<h3>Sample UI Screenshots</h3>

<p>
  <img src="https://i.postimg.cc/gcsknPWv/Screenshot-2025-06-02-213257.png" alt="Screenshot 1" width="500" />
</p>

<p>
  <img src="https://i.postimg.cc/TYHdJqh1/Screenshot-2025-06-02-213319.png" alt="Screenshot 2" width="500" />
</p>

<p>
  <img src="https://i.postimg.cc/02N5SHkh/Screenshot-2025-06-02-213336.png" alt="Screenshot 3" width="500" />
</p>

<p>
  <img src="https://i.postimg.cc/2SbzcbBw/Screenshot-2025-06-05-195134.png" alt="Screenshot 4" width="500" />
</p>
