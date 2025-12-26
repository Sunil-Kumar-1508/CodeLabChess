const express = require("express");
const cors = require("cors");
const analyzeGame = require("./analyze");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { pgn } = req.body;

  if (!pgn) {
    return res.status(400).json({ error: "PGN required" });
  }

  const result = await analyzeGame(pgn);
  res.json(result);
});

app.listen(5000, () => {
  console.log("✅ Backend running at http://localhost:5000");
});
