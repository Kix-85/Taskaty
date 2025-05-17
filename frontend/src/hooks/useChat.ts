import { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

interface Message {
    _id: string;
    sender: {
        _id: string;
        name: string;
        avatar: string;
    };
    receiver: {
        _id: string;
        name: string;
        avatar: string;
    };
    content: string;
    messageType: "text" | "emoji" | "file";
    timestamp: string;
    isRead: boolean;
}

export const useChat = () => {
    const [socket, setSocket] = useState<ReturnType<typeof socketIOClient> | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    useEffect(() => {
        // Initialize socket connection
        const newSocket = socketIOClient(`${import.meta.env.VITE_API_URL}`, {
            autoConnect: true,
            transports: ['websocket']
        });

        // Socket event handlers
        newSocket.on('connect', () => {
            console.log('Connected to chat server');
        });

        newSocket.on('message', (message: Message) => {
            setMessages(prev => [...prev, message]);
        });

        newSocket.on('online_users', (users: string[]) => {
            setOnlineUsers(users);
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            newSocket.close();
        };
    }, []);

    const sendMessage = (receiverId: string, content: string, type: "text" | "emoji" | "file" = "text") => {
        if (socket) {
            socket.emit('message', {
                receiverId,
                content,
                messageType: type
            });
        }
    };

    const markMessagesAsRead = (senderId: string) => {
        if (socket) {
            socket.emit('mark_read', { senderId });
        }
    };

    return {
        messages,
        onlineUsers,
        sendMessage,
        markMessagesAsRead
    };
};