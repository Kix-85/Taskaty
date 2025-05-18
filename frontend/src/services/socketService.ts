import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

class SocketService {
  private socket: Socket | null = null;
  private roomId: string | null = null;

  connect() {
    if (!this.socket) {
      const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      this.socket = io(baseURL, {
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        path: '/socket.io',
        transports: ['websocket', 'polling'],
        autoConnect: true,
        forceNew: true,
        timeout: 10000,
      });

      this.socket.on('connect', () => {
        console.log('Connected to socket server');
        // Authenticate after connection
        const userId = localStorage.getItem('userId');
        if (userId) {
          this.socket?.emit('authenticate', userId);
        }
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        toast.error('Connection error occurred. Retrying...');
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from socket server:', reason);
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, try to reconnect
          this.socket?.connect();
        }
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
        toast.error('Connection error: ' + error.message);
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('Reconnected to socket server after', attemptNumber, 'attempts');
        // Re-authenticate after reconnection
        const userId = localStorage.getItem('userId');
        if (userId) {
          this.socket?.emit('authenticate', userId);
        }
      });

      this.socket.on('reconnect_error', (error) => {
        console.error('Socket reconnection error:', error);
        toast.error('Failed to reconnect to server');
      });

      // Handle online/offline events
      this.socket.on('user-online', (userId: string) => {
        console.log('User online:', userId);
      });

      this.socket.on('user-offline', (userId: string) => {
        console.log('User offline:', userId);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.roomId = null;
    }
  }

  // Chat functionality
  joinRoom(roomId: string, userId: string) {
    if (this.socket?.connected) {
      this.roomId = roomId;
      this.socket.emit('join-room', { roomId, userId });
    } else {
      console.warn('Socket not connected. Attempting to connect...');
      this.connect();
      setTimeout(() => this.joinRoom(roomId, userId), 1000);
    }
  }

  leaveRoom() {
    if (this.socket?.connected && this.roomId) {
      this.socket.emit('leave-room', { roomId: this.roomId });
      this.roomId = null;
    }
  }

  sendMessage(message: any) {
    if (this.socket?.connected) {
      this.socket.emit('send-message', {
        ...message,
        roomId: this.roomId
      });
    } else {
      toast.error('Not connected to chat server');
    }
  }

  onReceiveMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('receive-message', callback);
    }
  }

  // Video call functionality
  initiateVideoCall(signal: any, roomId: string, userId: string) {
    if (this.socket) {
      this.socket.emit('video-call-signal', { signal, roomId, callerId: userId });
    }
  }

  onReceiveVideoCall(callback: (data: { signal: any; callerId: string }) => void) {
    if (this.socket) {
      this.socket.on('receive-call-signal', callback);
    }
  }

  // Voice call functionality
  initiateVoiceCall(signal: any, roomId: string, userId: string) {
    if (this.socket) {
      this.socket.emit('voice-call-signal', { signal, roomId, callerId: userId });
    }
  }

  onReceiveVoiceCall(callback: (data: { signal: any; callerId: string }) => void) {
    if (this.socket) {
      this.socket.on('receive-voice-signal', callback);
    }
  }

  sendCallResponse(signal: any, roomId: string, targetId: string, accepted: boolean) {
    if (this.socket) {
      this.socket.emit('call-response', { signal, roomId, targetId, accepted });
    }
  }

  sendEndCall(roomId: string, userId: string) {
    if (this.socket) {
      this.socket.emit('end-call', { roomId, userId });
    }
  }

  onCallEnded(callback: (data: { userId: string }) => void) {
    if (this.socket) {
      this.socket.on('call-ended', callback);
    }
  }

  // User connection events
  onUserConnected(callback: (userId: string) => void) {
    if (this.socket) {
      this.socket.on('user-connected', callback);
    }
  }

  onUserDisconnected(callback: (userId: string) => void) {
    if (this.socket) {
      this.socket.on('user-disconnected', callback);
    }
  }

  // Remove event listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Get current room ID
  getCurrentRoom(): string | null {
    return this.roomId;
  }
}

export const socketService = new SocketService(); 