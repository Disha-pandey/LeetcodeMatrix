import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// Correct __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend files (HTML, CSS, JS)
app.use(express.static(__dirname));

// -------------------------------------
//         LEETCODE API ROUTE
// -------------------------------------
app.post("/leetcode", async (req, res) => {
  console.log("Server: Request received!");

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    console.log("Server: Response status from LeetCode:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LeetCode Error:", errorText);
      return res.status(500).json({ error: "LeetCode API returned an error" });
    }

    const data = await response.json();
    console.log("Server: LeetCode Data:", JSON.stringify(data, null, 2));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// -------------------------------------
//         DEFAULT ROUTE
// -------------------------------------
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ---------- IMPORTANT for Deployment ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
