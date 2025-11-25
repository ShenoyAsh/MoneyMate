import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  // REMOVE THIS LINE: characteristics: ["userId"], 
  // Deleting it allows Arcjet to use the client's IP address by default,
  // which works for both authenticated and unauthenticated users.
  
  rules: [
    // Shield protects against common attacks (SQL injection, XSS, etc.)
    shield({ mode: "LIVE" }),
    
    // Bot detection
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"], // Allow Google, Bing, etc.
    }),

    // Rate limiting
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 3600,
      capacity: 10,
    }),
  ],
});

export default aj;