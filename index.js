import express from "express";
import axios from "axios";
import path from "path";

const app = express();
app.use(express.json());

// serve frontend
app.use(express.static("public"));

const AI_API = "https://api.bluesminds.com/v1/chat/completions";

// ===== CHAT API =====
app.post("/api/chat", async (req, res) => {
  const message = req.body?.message || "hello";

  try {
    const response = await axios.post(
      AI_API,
      {
        model: "claude-opus-4.6",
        messages: [
          {
            role: "system",
            content: "You are a helpful AI assistant."
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      response.data?.choices?.[0]?.message?.content ||
      "No response";

    res.json({ reply });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.json({ reply: "AI error, please try again." });
  }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on " + PORT);
});
