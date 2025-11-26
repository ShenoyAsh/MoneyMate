const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listAllModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // This is a workaround to verify connectivity since the SDK hides the list method sometimes
    console.log("Testing connectivity with gemini-2.5-flash...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Test");
    console.log("Success! 'gemini-2.5-flash' is working.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}
listAllModels();