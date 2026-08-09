const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Initialise the Gemini client.
 * Lazy-loaded on first import so the key is read after dotenv runs.
 */
let genAI = null;

const getGenAI = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

module.exports = { getGenAI };
