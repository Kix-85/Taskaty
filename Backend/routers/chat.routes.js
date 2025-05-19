const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const authenticateToken = require('../middlewares/verifyToken.middleware');

// Apply the authentication middleware to all routes
router.use(authenticateToken);

// AI Assistant routes
router.post('/generate', chatController.generateResponse);

// Message routes
router.get('/history', chatController.getConversations);
router.get('/:userId', chatController.getConversation);
router.post('/read/:senderId', chatController.markAsRead);
router.post('/call/initiate', chatController.initiateCall);
router.post('/call/accept/:callId', chatController.acceptCall);
router.post('/call/reject/:callId', chatController.rejectCall);
router.post('/call/end/:callId', chatController.endCall);

module.exports = router;