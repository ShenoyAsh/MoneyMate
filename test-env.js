import 'dotenv/config';
console.log("Key present?", !!process.env.GEMINI_API_KEY);
if (process.env.GEMINI_API_KEY) console.log("Key starts with:", process.env.GEMINI_API_KEY.substring(0, 5));