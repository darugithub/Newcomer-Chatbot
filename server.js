const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");

const app = express();
const port = 3000;

console.log("Hello, World!");
// Set up Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Parse JSON request body
app.use(express.json());

// API endpoint to handle chat requests
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "No message provided" });
    }

    // Generate response using Google Generative AI
    const result = await model.generateContent(userMessage);
    console.log("Bot response:", result);
    console.log("Bot reply:", result.response.candidates[0].content.parts[0].text);
    // Convert the response to a string if it's an object
    if (!result || !result.response || !result.response.candidates || 
      !result.response.candidates[0] || !result.response.candidates[0].content) {
      throw new Error('Invalid response structure from AI model');
    }
    let responseText = result.response.candidates[0].content.parts[0].text;
    res.json({ response: responseText });
  } catch (error) {
    console.error("❌ Error generating response:", error);
    res.status(500).json({ error: error.message || "Error generating response" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});