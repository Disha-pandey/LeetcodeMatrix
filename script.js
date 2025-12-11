document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ DOM Loaded");

  const input = document.getElementById("user-input");
  const button = document.getElementById("search-button");
  const statsContainer = document.querySelector(".stats-card");

  button.addEventListener("click", async () => {
    const username = input.value.trim();
    console.log("🔎 Username entered:", username);

    if (!username) {
      statsContainer.innerHTML = `<p style="color:red;">Please enter a username.</p>`;
      return;
    }

    try {
      const response = await fetch("https://leetcodematrix.onrender.com/leetcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query getUserProfile($username: String!) {
              allQuestionsCount {
                difficulty
                count
              }
              matchedUser(username: $username) {
                submitStats {
                  acSubmissionNum {
                    difficulty
                    count
                    submissions
                  }
                  totalSubmissionNum {
                    difficulty
                    count
                    submissions
                  }
                }
              }
            }
          `,
          variables: { username }
        }),
      });

      const data = await response.json();
      console.log("📦 Parsed data:", data);

      if (
        !data.data ||
        !data.data.matchedUser ||
        !data.data.matchedUser.submitStats
      ) {
        statsContainer.innerHTML = `<p style="color:red;">⚠️ No data found for this user</p>`;
        return;
      }

      const stats = data.data.matchedUser.submitStats.acSubmissionNum;

      // UI update
      statsContainer.innerHTML = `
        <h2 class="text-xl font-bold">LeetCode Stats for ${username}</h2>
        <ul>
          <li><strong>All:</strong> ${stats[0].count}</li>
          <li><strong>Easy:</strong> ${stats[1].count}</li>
          <li><strong>Medium:</strong> ${stats[2].count}</li>
          <li><strong>Hard:</strong> ${stats[3].count}</li>
        </ul>
      `;

      // Circle labels update
      document.getElementById("easy-label").textContent = stats[1].count;
      document.getElementById("Medium-label").textContent = stats[2].count;
      document.getElementById("Hard-label").textContent = stats[3].count;

    } catch (err) {
      console.error("❌ Error fetching data:", err);
      statsContainer.innerHTML = `<p style="color:red;">Server error. Please try again later.</p>`;
    }
  });
});
