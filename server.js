import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/leetcode", async (req, res) => {
    console.log("Server: Request received!");
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    console.log("Server: Response status from LeetCode is", response.status); 
     // Check if LeetCode responded with an error
    if (!response.ok) {
        console.error("Server: Failed to fetch from LeetCode. Status:", response.status);
        const errorText = await response.text();
        console.error("Server: LeetCode response body:", errorText);
        throw new Error("LeetCode API returned an error");
    }
    const data = await response.json();
    console.log("Server: Full data from LeetCode:", JSON.stringify(data, null, 2));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
