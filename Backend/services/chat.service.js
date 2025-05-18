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

    async getUserConversations(userId) {
        try {
            // Get all messages where user is either sender or receiver
            const messages = await Message.find({
                $or: [
                    { sender: userId },
                    { receiver: userId }
                ]
            })
            .sort({ timestamp: -1 })
            .populate('sender', 'name avatar status')
            .populate('receiver', 'name avatar status');

            // Group messages by conversation
            const conversationsMap = new Map();

            messages.forEach(message => {
                const otherUser = message.sender._id.toString() === userId 
                    ? message.receiver 
                    : message.sender;
                const conversationId = otherUser._id.toString();

                if (!conversationsMap.has(conversationId)) {
                    conversationsMap.set(conversationId, {
                        _id: conversationId,
                        participants: [otherUser],
                        lastMessage: message,
                        unreadCount: message.receiver._id.toString() === userId && !message.isRead ? 1 : 0
                    });
                } else {
                    const conversation = conversationsMap.get(conversationId);
                    if (message.receiver._id.toString() === userId && !message.isRead) {
                        conversation.unreadCount++;
                    }
                }
            });

            // Convert map to array and sort by last message timestamp
            const conversations = Array.from(conversationsMap.values())
                .sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);

            return conversations;
        } catch (error) {
            console.error('Error getting user conversations:', error);
            throw new Error('Error fetching user conversations: ' + error.message);
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