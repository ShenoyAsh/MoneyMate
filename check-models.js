const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Dummy init
    console.log("Checking available models...");
    // There isn't a direct listModels in the simpler SDK sometimes, 
    // but if we try to run this it might give us a hint or we just test the key.
    // Actually, let's just try a simple prompt to 'gemini-pro' to verify connectivity.
    
    const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await modelPro.generateContent("Test");
    console.log("Success! 'gemini-pro' is available.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

listModels();