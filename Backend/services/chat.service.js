const Message = require('../models/chat.model');

class ChatService {
    async saveMessage(messageData) {
        try {
            const message = new Message(messageData);
            await message.save();
            return message;
        } catch (error) {
            throw new Error('Error saving message: ' + error.message);
        }
    }

    async getConversation(userId1, userId2, limit = 50) {
        try {
            const messages = await Message.find({
                $or: [
                    { sender: userId1, receiver: userId2 },
                    { sender: userId2, receiver: userId1 }
                ]
            })
            .sort({ timestamp: -1 })
            .limit(limit)
            .populate('sender', 'name avatar')
            .populate('receiver', 'name avatar');
            
            return messages;
        } catch (error) {
            throw new Error('Error fetching conversation: ' + error.message);
        }
    }

    async markAsRead(senderId, receiverId) {
        try {
            await Message.updateMany(
                { sender: senderId, receiver: receiverId, isRead: false },
                { $set: { isRead: true } }
            );
        } catch (error) {
            throw new Error('Error marking messages as read: ' + error.message);
        }
    }
}

module.exports = new ChatService(); 