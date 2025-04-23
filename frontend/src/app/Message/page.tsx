"use client";
import { SiPaypal } from "react-icons/si";
import { MdWaterDrop } from "react-icons/md";
import { FaYoutube } from "react-icons/fa";
import { LuBed } from "react-icons/lu";
import { FaRegSmile } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { EmojiClickData } from "emoji-picker-react";
import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { faVideo } from "@fortawesome/free-solid-svg-icons/faVideo";

const App: React.FC = () => {
const [messages, setMessages] = useState([
{ id: 1, sender: 'Jenny Wilson', time: '2 min ago', text: 'Hey there!', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20woman%20with%20short%20blonde%20hair%2C%20business%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20clear%20facial%20features&width=40&height=40&seq=1&orientation=squarish' },
{ id: 2, sender: 'Cody Fisher', time: '22 min ago', text: 'Hey there!', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20man%20with%20brown%20hair%2C%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20clear%20facial%20features&width=40&height=40&seq=2&orientation=squarish' },
{ id: 3, sender: 'Wade Warren', time: '35 min ago', text: 'Online', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20man%20with%20dark%20hair%20and%20glasses%2C%20business%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20clear%20facial%20features&width=40&height=40&seq=3&orientation=squarish' },
{ id: 4, sender: 'Kristin Watson', time: '1 days ago', text: 'Hey there!', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20woman%20with%20brown%20hair%2C%20business%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20clear%20facial%20features&width=40&height=40&seq=4&orientation=squarish' },
{ id: 5, sender: 'Guy Hawkins', time: '2 days ago', text: 'Hey there!', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20man%20with%20dark%20hair%2C%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20clear%20facial%20features&width=40&height=40&seq=5&orientation=squarish' },
{ id: 6, sender: 'Esther Howard', time: '2 days ago', text: 'Hey there!', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20woman%20with%20curly%20hair%2C%20business%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20clear%20facial%20features&width=40&height=40&seq=6&orientation=squarish' },
{ id: 7, sender: 'Floyd Miles', time: '3 days ago', text: 'Hey there!', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20man%20with%20short%20hair%2C%20business%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20clear%20facial%20features&width=40&height=40&seq=7&orientation=squarish' },
]);
const [activeChat, setActiveChat] = useState(3);
const [newMessage, setNewMessage] = useState('');
const [showEmojiPicker, setShowEmojiPicker] = useState(false);
const [chatMessages, setChatMessages] = useState([
{ id: 1, sender: 'Wade Warren', time: '21 min ago', text: 'Hi DJ! 👋', avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20man%20with%20dark%20hair%20and%20glasses%2C%20business%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20clear%20facial%20features&width=40&height=40&seq=3&orientation=squarish', isMe: false },
{ id: 2, sender: 'D Smoaki', time: '20 min ago', text: "How's the work on the direction selection screen going?", avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20man%20with%20beard%2C%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20clear%20facial%20features&width=40&height=40&seq=8&orientation=squarish', isMe: true },
{ id: 3, sender: 'D Smoaki', time: '20 min ago', text: "Perfect! I have already created some of mockups. I think we should focus on visual elements so they can be easily distinguished from each other.", avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20man%20with%20beard%2C%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20clear%20facial%20features&width=40&height=40&seq=8&orientation=squarish', isMe: true },
{ id: 4, sender: 'Wade Warren', time: '21 min ago', text: "I agree. I also thought that it would be worth adding filters to identify user, for example, team members, executives, active users. This will simplify the search.", avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20man%20with%20dark%20hair%20and%20glasses%2C%20business%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20clear%20facial%20features&width=40&height=40&seq=3&orientation=squarish', isMe: false },
{ id: 5, sender: 'D Smoaki', time: '20 min ago', text: "Great idea!", avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20man%20with%20beard%2C%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20clear%20facial%20features&width=40&height=40&seq=8&orientation=squarish', isMe: true },
{ id: 6, sender: 'D Smoaki', time: '20 min ago', text: "I can make a drop-down menu with these filters. How about adding the ability to save favorite combinations?", avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20man%20with%20beard%2C%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20clear%20facial%20features&width=40&height=40&seq=8&orientation=squarish', isMe: true },
{ id: 7, sender: 'Wade Warren', time: '21 min ago', text: "Yes, that would be useful. We definitely need filters to sort between them. There will be tabs for saving user presets for favorites.", avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20man%20with%20dark%20hair%20and%20glasses%2C%20business%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20clear%20facial%20features&width=40&height=40&seq=3&orientation=squarish', isMe: false },
]);
const chatEndRef = useRef<HTMLDivElement>(null);
const emojiPickerRef = useRef<HTMLDivElement>(null);
useEffect(() => {
scrollToBottom();
}, [chatMessages]);
useEffect(() => {
function handleClickOutside(event: MouseEvent) {
if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
setShowEmojiPicker(false);
}
}
document.addEventListener('mousedown', handleClickOutside);
return () => {
document.removeEventListener('mousedown', handleClickOutside);
};
}, []);
const scrollToBottom = () => {
chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
};
const handleSendMessage = () => {
if (newMessage.trim() === '') return;
const newChatMessage = {
id: chatMessages.length + 1,
sender: 'D Smoaki',
time: 'Just now',
text: newMessage,
avatar: 'https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20man%20with%20beard%2C%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20clear%20facial%20features&width=40&height=40&seq=8&orientation=squarish',
isMe: true
};
setChatMessages([...chatMessages, newChatMessage]);
setNewMessage('');
setShowEmojiPicker(false);
};
const handleKeyDown = (e: React.KeyboardEvent) => {
if (e.key === 'Enter' && !e.shiftKey) {
e.preventDefault();
handleSendMessage();
}
};
const addEmoji = (emoji: string) => {
setNewMessage(prev => prev + emoji);
setShowEmojiPicker(false);
};
const toggleEmojiPicker = () => {
setShowEmojiPicker(!showEmojiPicker);
};
return (
<div className="flex h-screen bg-[#1D2032] w-full text-white font-sans">
{/* Left Sidebar */}
<div className="w-64 border-r border-gray-700 flex flex-col">
{/* User Profile */}
<div className="p-4 flex items-center space-x-2 border-b border-gray-700">
<div className="w-10 h-10 rounded-full overflow-hidden">
<img
src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20man%20with%20beard%2C%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20clear%20facial%20features&width=40&height=40&seq=8&orientation=squarish"
alt="Profile"
className="w-full h-full object-cover"
/>
</div>
<div>
<div className="font-medium">D Smoaki</div>
<div className="text-xs text-gray-400">Product Designer</div>
</div>
</div>
{/* Navigation Menu */}
<div className="flex-1 overflow-y-auto">
<div className="p-4">
<div className="text-xs text-gray-400 uppercase mb-2">Menu</div>
<ul className="space-y-2">
<li className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 cursor-pointer">
<i className="fas fa-home text-gray-400"></i>
<span>Home</span>
</li>
<li className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 cursor-pointer">
<i className="fas fa-tasks text-gray-400"></i>
<span>My Tasks</span>
</li>
<li className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 cursor-pointer">
<i className="fas fa-project-diagram text-gray-400"></i>
<span>Projects</span>
</li>
<li className="flex items-center space-x-3 p-2 rounded bg-blue-900 cursor-pointer">
<i className="fas fa-comment text-white"></i>
<span>Message</span>
</li>
<li className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 cursor-pointer">
<i className="fas fa-cog text-gray-400"></i>
<span>Settings</span>
</li>
</ul>
</div>
{/* Projects Section */}
<div className="p-4">
<div className="text-xs text-gray-400 uppercase mb-2 flex items-center justify-between">
<span>Projects</span>
<i className="fas fa-plus text-gray-400 cursor-pointer"></i>
</div>
<ul className="space-y-2">
<li className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 cursor-pointer">
<div className="w-6 h-6 bg-yellow-500 rounded-md flex items-center justify-center">
<LuBed />
</div>
<span>Sleepasy App</span>
</li>
<li className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 cursor-pointer">
<div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
<SiPaypal />

</div>
<span>PayPal App</span>
</li>
<li className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 cursor-pointer">
<div className="w-6 h-6 bg-purple-500 rounded-md flex items-center justify-center">
<MdWaterDrop />
</div>
<span>Dribble Posts</span>
</li>
<li className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 cursor-pointer">
<div className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center">
<FaYoutube />
</div>
<span>Youtube</span>
</li>
</ul>
</div>
</div>
{/* Let's Start Section */}
<div className="p-4 bg-[#1A1C2E] rounded-lg m-4">
<h3 className="font-medium mb-2">Let's start!</h3>
<p className="text-xs text-gray-400 mb-4">Creating or adding new tasks, just do the above</p>
<button className="bg-blue-600 text-white text-xs py-2 px-4 rounded-lg w-full flex items-center justify-center space-x-2 !rounded-button whitespace-nowrap">
<i className="fas fa-chart-line"></i>
<span>Improvements</span>
</button>
</div>
</div>
{/* Middle Column - Chat List */}
<div className="w-72 border-r border-gray-700 flex flex-col">
{/* Header */}
<div className="p-4 border-b border-gray-700 flex items-center justify-between">
<div className="flex items-center space-x-2">
<i className="fas fa-comment-dots text-blue-500"></i>
<h2 className="font-medium">Message</h2>
<span className="bg-gray-700 text-xs px-2 py-0.5 rounded-full">5</span>
</div>
</div>
{/* Search */}
<div className="p-4">
<div className="relative">
<input
type="text"
placeholder="Search"
className="w-full bg-gray-800 rounded-lg py-2 pl-9 pr-4 text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
<i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
</div>
</div>
{/* Filter */}
<div className="px-4 pb-2 flex items-center justify-between">
<div className="font-medium">Message</div>
{/* <button className="text-gray-400 hover:text-white cursor-pointer flex items-center space-x-1 !rounded-button whitespace-nowrap"> */}
<button className="text-gray-400 hover:text-white cursor-pointer flex items-center space-x-1 !rounded-button whitespace-nowrap">
<span>Filter</span>
<i className="fas fa-filter text-xs"></i>
</button>
</div>
{/* Chat List */}
<div className="flex-1 overflow-y-auto">
{messages.map((message) => (
<div
key={message.id}
className={`p-4 hover:bg-gray-800 cursor-pointer flex items-center space-x-3 ${activeChat === message.id ? 'bg-gray-800' : ''}`}
onClick={() => setActiveChat(message.id)}
>
<div className="relative">
<img
src={message.avatar}
alt={message.sender}
className="w-10 h-10 rounded-full object-cover"
/>
{message.id === 3 && (
<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1D2032]"></div>
)}
</div>
<div className="flex-1 min-w-0">
<div className="flex justify-between items-center">
<h3 className="font-medium truncate">{message.sender}</h3>
<span className="text-xs text-gray-400">{message.time}</span>
</div>
<p className="text-sm text-gray-400 truncate">{message.text}</p>
</div>
</div>
))}
</div>
{/* New Task Button */}
<div className="p-4">
<button className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full flex items-center justify-center space-x-2 !rounded-button whitespace-nowrap">
<i className="fas fa-plus"></i>
<span>New Task</span>
</button>
</div>
</div>
{/* Right Column - Chat Window */}
<div className="flex-1 flex flex-col">
{/* Chat Header */}
<div className="p-4 border-b border-gray-700 flex items-center justify-between">
<div className="flex items-center space-x-3">
<img
src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20man%20with%20dark%20hair%20and%20glasses%2C%20business%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20professional%20lighting%2C%20clear%20facial%20features&width=40&height=40&seq=3&orientation=squarish"
alt="Wade Warren"
className="w-10 h-10 rounded-full object-cover"
/>
<div>
<h3 className="font-medium">Wade Warren</h3>
<p className="text-xs text-green-500">Online</p>
</div>
</div>
    <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={ faVideo} className="text-[20px] cursor-pointer mr-[20px]" />
        {/* i need phone icon */}
        <FontAwesomeIcon icon={faPhone} className="text-[20px] cursor-pointer" />      
        <button className="bg-[#155dfc] transition-all duration-300 cursor-pointer hover:bg-[#1d39c4] ml-[8px] text-white py-2 px-4 rounded-lg flex items-center space-x-2 !rounded-button whitespace-nowrap">        
            <i className="fas fa-paperclip text-xs"></i>
            <span>Attach Task</span>
        </button>
    </div>
</div>
{/* Chat Messages */}
<div className="flex-1 overflow-y-auto p-4 space-y-4">
{chatMessages.map((msg) => (
<div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
<div className={`flex ${msg.isMe ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 ${msg.isMe ? 'space-x-reverse' : ''} max-w-[80%]`}>
<img
src={msg.avatar}
alt={msg.sender}
className="w-8 h-8 rounded-full object-cover"
/>
<div className={`${msg.isMe ? 'bg-blue-600' : 'bg-gray-700'} p-3 rounded-lg rounded-bl-none max-w-md`}>
<p className="text-sm">{msg.text}</p>
</div>
</div>
</div>
))}
<div ref={chatEndRef}></div>
</div>
{/* Message Input */}
<div className="p-4 border-t border-gray-700">
<div className="relative">
<textarea
value={newMessage}
onChange={(e) => setNewMessage(e.target.value)}
onKeyDown={handleKeyDown}
placeholder="Write a message..."
className="w-full bg-gray-800 rounded-lg py-3 px-4 pr-12 text-sm min-h-[50px] max-h-32 border-none focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
/>
<div className="absolute right-2 bottom-2 flex items-center space-x-2">
<button
// onClick={toggleEmojiPicker}
className="text-gray-400 hover:text-white cursor-pointer !rounded-button whitespace-nowrap"
>
    <FontAwesomeIcon icon={faPaperclip} />
</button>
<button
onClick={toggleEmojiPicker}
className="text-gray-400 hover:text-white cursor-pointer !rounded-button whitespace-nowrap"
>
<FaRegSmile />
</button>
<button
onClick={handleSendMessage}
className="bg-blue-600 text-white p-2 cursor-pointer rounded-lg !rounded-button whitespace-nowrap"
>
<IoSend />
</button>
</div>
{/* Emoji Picker */}
{showEmojiPicker && (
<div
ref={emojiPickerRef}
className="absolute bottom-14 right-0 z-10"
>
<EmojiPicker
onEmojiClick={(emojiData: EmojiClickData) => {
addEmoji(emojiData.emoji);
}}
width={320}
height={400}
searchDisabled={false}
skinTonesDisabled={true}
previewConfig={{
showPreview: false
}}
/>
</div>
)}
</div>
</div>
</div>
</div>
);
};
export default App
