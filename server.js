/* global process */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Main generate itinerary endpoint
app.post('/api/generate', async (req, res) => {
  const { prompt, existingItinerary } = req.body;

  // 1. Check if the prompt is valid
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({
      error: 'Invalid Request',
      message: 'Please provide a valid text description for your trip.'
    });
  }

  // 2. Check if the Gemini API Key is configured
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY') {
    return res.status(401).json({
      error: 'Missing API Key',
      message: 'GEMINI_API_KEY is not configured in the backend environment. Please check the README and create a .env file.'
    });
  }

  try {
    // 3. Initialize Gemini client
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We use gemini-3.5-flash which supports JSON response types, and has a generous free tier.
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash',
      systemInstruction: 'You are an expert travel planner. You generate highly practical, structured, and customized day-by-day travel itineraries in JSON. You strictly output JSON arrays containing day objects; never return normal text summaries outside the JSON.'
    });

    let promptQuery;
    if (existingItinerary) {
      promptQuery = `You are refining an existing day-by-day travel itinerary.
Here is the existing itinerary in JSON format:
${JSON.stringify(existingItinerary, null, 2)}

The user wants to make the following edits/refinements: "${prompt}".

Apply the requested changes to the existing itinerary. You can add days, remove days, edit stops, add stops, re-arrange, or modify details as requested, but keep the overall day-by-day structure consistent.

The response MUST be a valid JSON array of days. Do not include markdown code block syntax (like \`\`\`json) or any conversational text around the JSON array. Output ONLY the JSON array.

Each day object in the array must match this exact format:
{
  "dayNumber": number (e.g. 1),
  "title": "A short descriptive title for the day's activities",
  "theme": "The main theme of this day (e.g. Culinary Exploration, Art & Museum)",
  "stops": [
    {
      "time": "Morning" | "Afternoon" | "Evening",
      "activity": "Specific name of the attraction/activity",
      "description": "Engaging description with tips, details, and what to see there.",
      "location": "Accurate street name, area, or landmark name",
      "duration": "Estimated time to spend (e.g. 2 hours, 45 minutes)",
      "cost": "Estimated cost (e.g. Free, ¥1500, $20)"
    }
  ]
}

Provide stops in chronological order (Morning -> Afternoon -> Evening). Be creative, specific, and realistic about walking times and pacing.`;
    } else {
      promptQuery = `Create a detailed day-by-day travel itinerary based on this request: "${prompt}".

The response MUST be a valid JSON array of days. Do not include markdown code block syntax (like \`\`\`json) or any conversational text around the JSON array. Output ONLY the JSON array.

Each day object in the array must match this exact format:
{
  "dayNumber": number (e.g. 1),
  "title": "A short descriptive title for the day's activities",
  "theme": "The main theme of this day (e.g. Culinary Exploration, Art & Museum)",
  "stops": [
    {
      "time": "Morning" | "Afternoon" | "Evening",
      "activity": "Specific name of the attraction/activity",
      "description": "Engaging description with tips, details, and what to see there.",
      "location": "Accurate street name, area, or landmark name",
      "duration": "Estimated time to spend (e.g. 2 hours, 45 minutes)",
      "cost": "Estimated cost (e.g. Free, ¥1500, $20)"
    }
  ]
}

Provide between 2 to 7 days of activities based on the user's description (default to 3 days if unspecified). Provide 2 to 4 stops per day in chronological order (Morning -> Afternoon -> Evening). Be creative, specific, and realistic about walking times and pacing.`;
    }

    // Fetch response from generator
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: promptQuery }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = result.response.text();

    if (!responseText) {
      throw new Error('Received an empty response from the planner service.');
    }

    // 4. Defensive Parsing: clean and parse JSON response
    let cleanJsonText = responseText.trim();
    
    // If the planner wrapped it in markdown code blocks despite instructions, extract it.
    if (cleanJsonText.startsWith('```')) {
      const match = cleanJsonText.match(/^(?:```[a-zA-Z]*\n?)([\s\S]*?)(?:\n?```)$/);
      if (match && match[1]) {
        cleanJsonText = match[1].trim();
      }
    }

    // Double-check using regex boundaries if we got extra commentary text
    const firstBracket = cleanJsonText.indexOf('[');
    const lastBracket = cleanJsonText.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
      cleanJsonText = cleanJsonText.slice(firstBracket, lastBracket + 1);
    }

    try {
      const parsedItinerary = JSON.parse(cleanJsonText);
      return res.json({ itinerary: parsedItinerary });
    } catch (parseError) {
      console.error('Failed to parse planner output as JSON:', parseError, cleanJsonText);
      return res.status(502).json({
        error: 'Malformed Planner Output',
        message: 'The planner service returned text that could not be parsed as valid JSON. Please try again.',
        rawOutput: responseText.slice(0, 500)
      });
    }

  } catch (error) {
    console.error('Error generating itinerary:', error);
    
    // Check for specific service error indicators (e.g. quota, rate limits)
    let userMessage = 'An unexpected error occurred while generating your itinerary.';
    if (error.message && error.message.includes('API_KEY_INVALID')) {
      userMessage = 'The provided API Key is invalid. Please double-check your credentials.';
    } else if (error.message && error.message.includes('QUOTA_EXCEEDED')) {
      userMessage = 'Service quota exceeded. Please wait a minute or try again later.';
    } else if (error.message) {
      userMessage = error.message;
    }

    return res.status(500).json({
      error: 'Planner Generation Failed',
      message: userMessage
    });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server is running on port ${PORT}`);
});