import { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Smile, Send, Paperclip, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface MessageInputProps {
    receiverId: string;
    onSendMessage: (content: string, type?: "text" | "emoji" | "file") => void;
}

export function MessageInput({ receiverId, onSendMessage }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when receiver changes
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [receiverId]);

    const handleSendMessage = async () => {
        if (message.trim() || file) {
            if (file) {
                // If there's a file to send, handle file upload
                try {
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    // Upload file to your server
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
                        method: 'POST',
                        credentials: 'include',
                        body: formData
                    });
                    
                    if (response.ok) {
                        const { fileUrl } = await response.json();
                        
                        // Send file message with the URL
                        onSendMessage(fileUrl, 'file');
                    } else {
                        alert('Failed to upload file. Please try again.');
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                    alert('Error uploading file. Please try again.');
                }
                
                // Clear file regardless of success/failure
                setFile(null);
            }
            
            // Send text message if there's text
            if (message.trim()) {
                onSendMessage(message.trim());
                setMessage('');
            }
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleEmojiSelect = (emoji: any) => {
        onSendMessage(emoji.native, "emoji");
        setIsEmojiPickerOpen(false);
        
        // Focus back on input after emoji selection
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleFileSelect = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const clearFile = () => {
        setFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="p-4 border-t bg-card">
            {file && (
                <div className="mb-2 p-2 bg-muted rounded flex items-center justify-between">
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearFile} 
                        className="h-6 w-6 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
            
            <div className="flex gap-2">
                <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="text-muted-foreground hover:text-foreground">
                            <Smile className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                        <Picker
                            data={data}
                            onEmojiSelect={handleEmojiSelect}
                            theme="light"
                            set="native"
                        />
                    </PopoverContent>
                </Popover>
                
                <Button 
                    variant="outline" 
                    size="icon"
                    onClick={handleFileSelect}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <Paperclip className="h-4 w-4" />
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                    />
                </Button>
                
                <Input
                    ref={inputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1"
                />
                
                <Button 
                    onClick={handleSendMessage} 
                    disabled={!message.trim() && !file}
                    size="icon"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}