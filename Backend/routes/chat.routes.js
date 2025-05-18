const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const auth = require('../middleware/auth');

// Initialize Gemini AI with error handling
let model;
try {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ 
        model: "gemini-pro",
        safetySettings: [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
            {
                category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ],
    });
    console.log('Gemini AI initialized successfully');
} catch (error) {
    console.error('Error initializing Gemini AI:', error);
}

// System prompt
const SYSTEM_PROMPT = `You are Taskaty, an AI assistant for a task management application. Your role is to help users with:

1. Task Management:
   - Creating and organizing tasks
   - Setting priorities and deadlines
   - Managing projects and workflows
   - Tracking progress and productivity

2. User Support:
   - Providing guidance on using Taskaty features
   - Answering questions about task management
   - Offering productivity tips and best practices
   - Helping with troubleshooting

3. Communication Style:
   - Be friendly and professional
   - Keep responses concise and clear
   - Use bullet points for lists
   - Include relevant emojis when appropriate
   - Maintain a helpful and encouraging tone

4. Context Awareness:
   - Adapt responses based on the current page (dashboard, tasks, settings, messages)
   - Consider the user's previous messages for context
   - Provide relevant suggestions based on the conversation

Remember to:
- Focus on task management and productivity
- Be proactive in offering helpful suggestions
- Maintain a consistent and professional tone
- Keep responses focused and actionable`;

// Generate AI response with retries
const generateAIResponse = async (message, context, history) => {
    if (!model) {
        throw new Error('Gemini AI model not initialized');
    }

    console.log('Generating AI response:', { 
        message, 
        context, 
        historyLength: history?.length,
        hasApiKey: !!process.env.GEMINI_API_KEY 
    });

    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
        try {
            // Prepare conversation history
            const formattedHistory = history.slice(-5).map(msg => ({
                role: msg.sender._id === 'user-1' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

            console.log('Formatted conversation history:', formattedHistory);

            // Create chat session
            const chat = model.startChat({
                history: formattedHistory,
                generationConfig: {
                    maxOutputTokens: 200,
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                },
            });

            // Generate response
            const prompt = `${SYSTEM_PROMPT}\n\nCurrent context: ${context}\n\nUser message: ${message}`;
            console.log('Sending prompt to Gemini:', prompt);

            const result = await chat.sendMessage(prompt);
            const response = await result.response;

            console.log('Received response from Gemini:', response.text());

            if (!response.text()) {
                throw new Error('Empty response from AI');
            }

            return response.text();
        } catch (error) {
            console.error(`Attempt ${retryCount + 1} failed:`, error);
            retryCount++;

            if (retryCount === maxRetries) {
                console.error('All retry attempts failed');
                throw new Error('All retry attempts failed');
            }

            // Exponential backoff
            const backoffTime = Math.pow(2, retryCount) * 1000;
            console.log(`Retrying in ${backoffTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, backoffTime));
        }
    }
};

// Chat endpoint
router.post('/message', auth, async (req, res) => {
    console.log('Received chat request:', {
        body: req.body,
        user: req.user,
        hasApiKey: !!process.env.GEMINI_API_KEY
    });

    try {
        const { message, context, history } = req.body;

        if (!message || !context) {
            console.error('Missing required fields:', { message, context });
            return res.status(400).json({ 
                error: 'Missing required fields',
                message: 'Message and context are required'
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not set');
            return res.status(500).json({ 
                error: 'AI service configuration error',
                message: "I apologize, but the AI service is not properly configured. Please contact support."
            });
        }

        if (!model) {
            console.error('Gemini AI model not initialized');
            return res.status(500).json({ 
                error: 'AI service initialization error',
                message: "I apologize, but the AI service is not properly initialized. Please try again later."
            });
        }

        console.log('Processing chat request...');
        const response = await generateAIResponse(message, context, history || []);
        
        if (!response) {
            throw new Error('Empty response from AI service');
        }

        console.log('Sending response to client:', response);
        res.json({ response });
    } catch (error) {
        console.error('Chat error:', error);
        
        // Send appropriate error response
        if (error.message.includes('API key')) {
            return res.status(500).json({ 
                error: 'AI service configuration error',
                message: "I apologize, but there's an issue with the AI service configuration. Please contact support."
            });
        }

        if (error.message.includes('not initialized')) {
            return res.status(500).json({ 
                error: 'AI service initialization error',
                message: "I apologize, but the AI service is not properly initialized. Please try again later."
            });
        }

        res.status(500).json({ 
            error: 'Failed to generate response',
            message: "I apologize, but I'm having trouble connecting right now. Could you try asking again in a moment?"
        });
    }
});

module.exports = router; 