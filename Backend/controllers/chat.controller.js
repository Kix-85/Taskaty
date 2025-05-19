const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user.model');
const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const generateResponse = async (req, res) => {
  try {
    // Verify token
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { message, context, history } = req.body;

    // Create conversation history in Gemini's format
    const formattedHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Add context to the conversation
    let prompt = message;
    if (context) {
      prompt = `Context: ${context}\n\nUser: ${message}`;
    }

    // Get the model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Start the chat
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      },
    });

    // Generate response
    const result = await chat.sendMessage(prompt);
    const response = result.response.text();

    res.json({ response });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
};

const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.aggregate([
      {
        $match: {
          participants: userId
        }
      },
      {
        $lookup: {
          from: 'messages',
          let: { conversationId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$conversationId', '$$conversationId'] }
              }
            },
            {
              $sort: { createdAt: -1 }
            },
            {
              $limit: 1
            }
          ],
          as: 'lastMessage'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'participants',
          foreignField: '_id',
          as: 'participants'
        }
      },
      {
        $addFields: {
          lastMessage: { $arrayElemAt: ['$lastMessage', 0] },
          unreadCount: {
            $size: {
              $filter: {
                input: '$messages',
                as: 'message',
                cond: {
                  $and: [
                    { $eq: ['$$message.receiver', userId] },
                    { $eq: ['$$message.read', false] }
                  ]
                }
              }
            }
          }
        }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    console.error('Error getting conversations:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
};

const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, userId] }
    });

    if (!conversation) {
      return res.json([]);
    }

    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email avatar')
      .populate('receiver', 'name email avatar');

    res.json(messages);
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({ error: 'Failed to get conversation' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { senderId } = req.params;
    const currentUserId = req.user._id;

    await Message.updateMany(
      {
        sender: senderId,
        receiver: currentUserId,
        read: false
      },
      {
        $set: { read: true }
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
};

const initiateCall = async (req, res) => {
  try {
    const { userId, type } = req.body;
    const currentUserId = req.user._id;

    // Generate a unique room ID
    const roomId = `${currentUserId}-${userId}-${Date.now()}`;

    // You would typically save this to a calls collection and handle WebRTC signaling
    // For now, we'll just return the room ID
    res.json({ roomId });
  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({ error: 'Failed to initiate call' });
  }
};

const acceptCall = async (req, res) => {
  try {
    const { callId } = req.params;
    // Handle call acceptance logic
    res.json({ success: true });
  } catch (error) {
    console.error('Error accepting call:', error);
    res.status(500).json({ error: 'Failed to accept call' });
  }
};

const rejectCall = async (req, res) => {
  try {
    const { callId } = req.params;
    // Handle call rejection logic
    res.json({ success: true });
  } catch (error) {
    console.error('Error rejecting call:', error);
    res.status(500).json({ error: 'Failed to reject call' });
  }
};

const endCall = async (req, res) => {
  try {
    const { callId } = req.params;
    // Handle call ending logic
    res.json({ success: true });
  } catch (error) {
    console.error('Error ending call:', error);
    res.status(500).json({ error: 'Failed to end call' });
  }
};

module.exports = {
  generateResponse,
  getConversations,
  getConversation,
  markAsRead,
  initiateCall,
  acceptCall,
  rejectCall,
  endCall
}; 