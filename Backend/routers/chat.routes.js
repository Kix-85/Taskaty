const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { 
  getConversations,
  getConversation,
  createConversation,
  sendMessage,
  getMessages,
  markMessageAsRead
} = require('../controllers/chat.controller');

// Conversation routes
router.get('/conversations', auth, getConversations);
router.get('/conversations/:id', auth, getConversation);
router.post('/conversations', auth, createConversation);

// Message routes
router.get('/messages/:conversationId', auth, getMessages);
router.post('/messages', auth, sendMessage);
router.patch('/messages/:id/read', auth, markMessageAsRead);

module.exports = router; 