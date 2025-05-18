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
    const conversations = await Conversation.find({
      participants: req.user._id
    })
    .populate('participants', 'name email')
    .populate({
      path: 'messages',
      options: { sort: { createdAt: -1 }, limit: 1 }
    })
    .sort({ lastActivity: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
};

const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      participants: req.user._id
    }).populate('participants', 'name email');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversation', error: error.message });
  }
};

const createConversation = async (req, res) => {
  try {
    const { participantIds, initialMessage } = req.body;
    
    // Ensure current user is included in participants
    const allParticipants = [...new Set([...participantIds, req.user._id])];

    const conversation = await Conversation.create({
      participants: allParticipants
    });

    if (initialMessage) {
      const message = await Message.create({
        conversationId: conversation._id,
        sender: req.user._id,
        receiver: participantIds[0], // Assuming 1-1 chat for now
        content: initialMessage,
        messageType: 'text'
      });

      conversation.messages.push(message._id);
      conversation.lastActivity = new Date();
      await conversation.save();
    }

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating conversation', error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await Message.find({
      conversationId
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate('sender', 'name email');

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { conversationId, content, receiverId, messageType = 'text' } = req.body;

    const message = await Message.create({
      conversationId,
      sender: req.user._id,
      receiver: receiverId,
      content,
      messageType
    });

    // Update conversation's last activity
    await Conversation.findByIdAndUpdate(conversationId, {
      $push: { messages: message._id },
      lastActivity: new Date()
    });

    await message.populate('sender', 'name email');
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

const markMessageAsRead = async (req, res) => {
  try {
    const message = await Message.findOneAndUpdate(
      {
        _id: req.params.id,
        receiver: req.user._id
      },
      { read: true },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error marking message as read', error: error.message });
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
  createConversation,
  getMessages,
  sendMessage,
  markMessageAsRead,
  markAsRead,
  initiateCall,
  acceptCall,
  rejectCall,
  endCall
}; 