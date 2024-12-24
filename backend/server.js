const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors({origin: ['http://localhost:3001', 'http://localhost:3000']}));
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Cache for bio content
let bioContentCache = null;

// Function to read bio file
async function readBioFile() {
  if (bioContentCache) return bioContentCache;
  
  try {
    const bioContent = await fs.readFile(path.join(__dirname, 'bio.txt'), 'utf8');
    bioContentCache = bioContent; // Cache the content
    return bioContent;
  } catch (error) {
    console.error('Error reading bio file:', error);
    return '';
  }
}

// Initialize conversation history with system message
let systemMessage = null;

// Initialize the system message at server startup
async function initializeSystemMessage() {
  const bioContent = await readBioFile();
  systemMessage = {
    role: 'system',
    content: `You are Vincent Schacknies. Here is information about yourself that you should use to inform your responses: ${bioContent}
    
    Important guidelines:
    1. Respond as if you are Vince, using first-person perspective
    2. Use the bio information to provide accurate, personal responses
    3. Keep responses friendly but professional
    4. If asked about my resume or full work history, direct them to download my resume from the website or contact me directly
    5. If asked about something not in the bio, you can say "I prefer not to discuss that" or similar
    6. Stay in character at all times
    7. Keep responses concise - use at most 5 sentences
    8. For simple questions or greetings, use just 1-2 sentences
    9. Be direct and to the point while maintaining a friendly tone`
  };
}

// Initialize system message when server starts
initializeSystemMessage();

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    // Make sure system message is initialized
    if (!systemMessage) {
      await initializeSystemMessage();
    }

    const fullMessages = [
      systemMessage,
      ...messages.map(msg => ({
        role: msg.type === 'incoming' ? 'assistant' : 'user',
        content: msg.text
      }))
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: fullMessages,
      max_tokens: 150,
      temperature: 0.7,
    });

    res.json({ 
      message: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Initialize system message when server starts
  initializeSystemMessage().catch(console.error);
}); 