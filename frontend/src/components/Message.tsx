import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { format } from 'date-fns';
import { File, Download } from 'lucide-react';

interface MessageProps {
    message: {
        _id: string;
        sender: {
            _id: string;
            name: string;
            avatar?: string;
        };
        content: string;
        messageType: 'text' | 'emoji' | 'file';
        timestamp: string;
        isRead: boolean;
    };
    isOwnMessage: boolean;
}

export function Message({ message, isOwnMessage }: MessageProps) {
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const renderContent = () => {
        switch (message.messageType) {
            case 'emoji':
                return (
                    <div className="flex flex-wrap gap-1">
                        {message.content.split('').map((emoji, index) => (
                            <span key={index} className="text-2xl">{emoji}</span>
                        ))}
                    </div>
                );
                
            case 'file':
                // Extract filename from URL or use a default
                const fileName = message.content.split('/').pop() || 'file';
                
                // Check if it's an image by extension
                const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
                
                if (isImage) {
                    return (
                        <div className="mt-1">
                            <img 
                                src={message.content} 
                                alt="Shared image" 
                                className="max-w-[200px] max-h-[200px] rounded-md object-cover"
                            />
                            <div className="flex items-center mt-1 text-xs text-slate-500">
                                <span className="truncate max-w-[150px]">{fileName}</span>
                                <a 
                                    href={message.content} 
                                    target="_blank" 
                                    download 
                                    className="ml-2"
                                >
                                    <Download className="h-3 w-3" />
                                </a>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className="flex items-center mt-1 bg-slate-100 rounded-md p-2">
                            <File className="h-5 w-5 mr-2 text-slate-500" />
                            <span className="truncate max-w-[150px] text-sm">{fileName}</span>
                            <a 
                                href={message.content} 
                                download 
                                className="ml-2"
                            >
                                <Download className="h-4 w-4 text-slate-500" />
                            </a>
                        </div>
                    );
                }
                
            case 'text':
            default:
                return (
                    <pre className="whitespace-pre-wrap break-words font-sans">
                        {message.content}
                    </pre>
                );
        }
    };

    return (
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[80%]`}>
                <Avatar className="h-8 w-8">
                    <AvatarImage src={message.sender.avatar} />
                    <AvatarFallback>{getInitials(message.sender.name)}</AvatarFallback>
                </Avatar>
                
                <div className={`
                    py-2 px-3 rounded-lg 
                    ${isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'}
                `}>
                    {renderContent()}
                    <div className={`
                        text-xs ${isOwnMessage ? 'text-blue-100' : 'text-gray-500'} 
                        mt-1 flex items-center justify-end gap-1
                    `}>
                        {format(new Date(message.timestamp), 'h:mm a')}
                        {isOwnMessage && (
                            <span className="text-xs">
                                {message.isRead ? '✓✓' : '✓'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}