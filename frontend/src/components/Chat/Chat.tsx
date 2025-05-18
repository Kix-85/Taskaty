import { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, Phone, Mic, MicOff, VideoOff, X } from "lucide-react";
import { socketService } from '@/services/socketService';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import Peer from 'simple-peer';

interface Message {
  id: string;
  text: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
}

interface ChatProps {
  roomId?: string;
  minimized?: boolean;
  onClose?: () => void;
}

export const Chat = ({ roomId, minimized = false, onClose }: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isVoiceCallActive, setIsVoiceCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Get user info from cookies
  const userId = Cookies.get('userId');
  const userName = Cookies.get('userName');
  const userAvatar = Cookies.get('userAvatar');

  useEffect(() => {
    const socket = socketService.connect();

    if (roomId && userId) {
      socketService.joinRoom(roomId, userId);
    }

    socketService.onReceiveMessage((message) => {
      setMessages(prev => [...prev, message]);
    });

    socketService.onReceiveVideoCall(({ signal, callerId }) => {
      handleIncomingCall(signal, callerId, true);
    });

    socketService.onReceiveVoiceCall(({ signal, callerId }) => {
      handleIncomingCall(signal, callerId, false);
    });

    return () => {
      cleanupMediaStream();
      if (roomId) {
        socketService.leaveRoom();
      }
      socketService.removeAllListeners();
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [roomId, userId]);

  const cleanupMediaStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !userId) return;

    const message: Message = {
      id: Math.random().toString(),
      text: inputMessage,
      sender: {
        id: userId,
        name: userName || 'Anonymous',
        avatar: userAvatar
      },
      timestamp: new Date()
    };

    socketService.sendMessage(message, roomId);
    setMessages(prev => [...prev, message]);
    setInputMessage('');
  };

  const createPeer = (stream: MediaStream, initiator: boolean): Peer.Instance => {
    const peer = new Peer({
      initiator,
      trickle: false,
      stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    });

    peer.on('error', (err) => {
      console.error('Peer connection error:', err);
      toast.error('Connection error occurred');
      cleanupCall();
    });

    peer.on('close', () => {
      cleanupCall();
    });

    return peer;
  };

  const startVideoCall = async () => {
    try {
      setIsConnecting(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const peer = createPeer(stream, true);

      peer.on('signal', (signal) => {
        socketService.initiateVideoCall(signal, roomId!, userId!);
      });

      peer.on('stream', (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      peerRef.current = peer;
      setIsVideoCallActive(true);
    } catch (error) {
      console.error('Error starting video call:', error);
      toast.error('Failed to access camera/microphone');
      cleanupCall();
    } finally {
      setIsConnecting(false);
    }
  };

  const startVoiceCall = async () => {
    try {
      setIsConnecting(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true 
      });
      
      localStreamRef.current = stream;
      const peer = createPeer(stream, true);

      peer.on('signal', (signal) => {
        socketService.initiateVoiceCall(signal, roomId!, userId!);
      });

      peer.on('stream', (remoteStream) => {
        const audio = new Audio();
        audio.srcObject = remoteStream;
        audio.play().catch(console.error);
      });

      peerRef.current = peer;
      setIsVoiceCallActive(true);
    } catch (error) {
      console.error('Error starting voice call:', error);
      toast.error('Failed to access microphone');
      cleanupCall();
    } finally {
      setIsConnecting(false);
    }
  };

  const handleIncomingCall = async (signal: any, callerId: string, isVideo: boolean) => {
    try {
      setIsConnecting(true);
      const constraints = isVideo ? { video: true, audio: true } : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      localStreamRef.current = stream;
      if (isVideo && localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const peer = createPeer(stream, false);

      peer.on('signal', (signal) => {
        socketService.sendCallResponse(signal, roomId!, callerId, true);
      });

      peer.on('stream', (remoteStream) => {
        if (isVideo && remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        } else {
          const audio = new Audio();
          audio.srcObject = remoteStream;
          audio.play().catch(console.error);
        }
      });

      peer.signal(signal);
      peerRef.current = peer;
      
      if (isVideo) {
        setIsVideoCallActive(true);
      } else {
        setIsVoiceCallActive(true);
      }
    } catch (error) {
      console.error('Error handling incoming call:', error);
      toast.error('Failed to answer call');
      socketService.sendCallResponse(null, roomId!, callerId, false);
      cleanupCall();
    } finally {
      setIsConnecting(false);
    }
  };

  const cleanupCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    cleanupMediaStream();
    setIsVideoCallActive(false);
    setIsVoiceCallActive(false);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = () => {
    if (roomId && userId) {
      socketService.sendEndCall(roomId, userId);
    }
    cleanupCall();
  };

  if (minimized) {
    return (
      <Button
        className="fixed bottom-4 right-4 p-2"
        onClick={() => onClose?.()}
      >
        <X className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Chat</CardTitle>
        <div className="flex items-center gap-2">
          {!isVideoCallActive && !isVoiceCallActive && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={startVideoCall}
                className="h-8 w-8"
              >
                <Video className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={startVoiceCall}
                className="h-8 w-8"
              >
                <Phone className="h-4 w-4" />
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onClose?.()}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {(isVideoCallActive || isVoiceCallActive) && (
        <div className="relative">
          {isVideoCallActive && (
            <div className="relative h-40">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="absolute bottom-2 right-2 w-24 h-24 object-cover rounded-lg"
              />
            </div>
          )}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
            <Button
              variant="destructive"
              size="icon"
              onClick={endCall}
              className="h-8 w-8 rounded-full"
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={toggleMute}
              className="h-8 w-8 rounded-full"
            >
              {isMuted ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            {isVideoCallActive && (
              <Button
                variant="secondary"
                size="icon"
                onClick={toggleVideo}
                className="h-8 w-8 rounded-full"
              >
                {isVideoOff ? (
                  <VideoOff className="h-4 w-4" />
                ) : (
                  <Video className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.sender.id === userId ? 'flex-row-reverse' : ''
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender.avatar} />
                  <AvatarFallback>
                    {message.sender.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-2 max-w-[70%] ${
                    message.sender.id === userId
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex w-full gap-2"
        >
          <Input
            placeholder="Type a message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
}; 