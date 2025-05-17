import React, { useState, useRef, KeyboardEvent, useEffect } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface MessageInputProps {
    onSendMessage: (content: string, type: 'text' | 'emoji' | 'file') => void;
    onSendFile?: (file: File) => void;
}

export function MessageInput({ onSendMessage, onSendFile }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        if (message.trim() || selectedFile) {
            if (selectedFile && onSendFile) {
                onSendFile(selectedFile);
                setSelectedFile(null);
            }
            if (message.trim()) {
                onSendMessage(message, 'text');
                setMessage('');
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                }
            }
        }
    };

    const handleEmojiSelect = (emoji: any) => {
        setMessage(prev => prev + emoji.native);
        // Don't close the emoji picker after selection
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (onSendFile) {
                onSendFile(file);
            }
        }
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        // Auto-resize textarea
        e.target.style.height = 'auto';
        e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
    };

    return (
        <div className="relative p-4 border-t dark:border-gray-700">
            {selectedFile && (
                <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px]">
                        {selectedFile.name}
                    </span>
                    <button
                        onClick={() => setSelectedFile(null)}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        ×
                    </button>
                </div>
            )}
            <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="w-full p-3 pr-24 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none min-h-[44px] max-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden"
                        rows={1}
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-1">
                        <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            type="button"
                        >
                            <Smile className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            type="button"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                
                <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() && !selectedFile}
                    className="p-2 rounded-lg bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <Send className="w-5 h-5" />
                </button>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            {showEmojiPicker && (
                <div 
                    ref={emojiPickerRef}
                    className="absolute bottom-full right-0 mb-2 z-50"
                >
                    <Picker
                        data={data}
                        onEmojiSelect={handleEmojiSelect}
                        theme="light"
                        set="native"
                        previewPosition="none"
                        skinTonePosition="none"
                        autoFocus
                    />
                </div>
            )}
        </div>
    );
}