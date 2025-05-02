"use client";
import React, { useState } from 'react';
const App: React.FC = () => {
const [isMessageOpen, setIsMessageOpen] = useState(false);
const toggleMessage = () => {
setIsMessageOpen(!isMessageOpen);
};
return (
<div className="flex h-screen bg-white text-gray-800 overflow-hidden">
{/* Sidebar */}
<div className="w-64 bg-gray-50 flex flex-col h-full border-r border-gray-200">
{/* User Profile */}
<div className="p-4 flex items-center space-x-3 border-b border-gray-200">
<div className="relative">
<img
src="https://readdy.ai/api/search-image?query=professional%20headshot%20photo%20of%20a%20business%20person%20in%20formal%20attire%20with%20neutral%20background%2C%20high%20quality%20corporate%20portrait&width=40&height=40&seq=123&orientation=squarish"
alt="User Profile"
className="w-10 h-10 rounded-full object-cover"
/>
<div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
</div>
<div>
<h3 className="font-medium">John Smith</h3>
<p className="text-xs text-gray-500">Project Manager</p>
</div>
</div>
{/* Navigation */}
<nav className="flex-1 py-4 overflow-y-auto">
<ul className="space-y-1 px-3">
<li>
<a href="#" className="flex items-center px-4 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer">
<i className="fas fa-home w-5 text-center"></i>
<span className="ml-3">Home</span>
</a>
</li>
<li>
<a href="#" className="flex items-center px-4 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer">
<i className="fas fa-tasks w-5 text-center"></i>
<span className="ml-3">My Tasks</span>
</a>
</li>
<li>
<a href="#" className="flex items-center px-4 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer">
<i className="fas fa-project-diagram w-5 text-center"></i>
<span className="ml-3">Projects</span>
</a>
</li>
<li>
<button
onClick={toggleMessage}
className={`flex items-center w-full px-4 py-2.5 rounded-lg hover:bg-gray-100 cursor-pointer ${isMessageOpen ? 'bg-gray-100 text-blue-600' : 'text-gray-600'}`}
>
<i className="fas fa-comment w-5 text-center"></i>
<span className="ml-3">Messages</span>
</button>
</li>
<li>
<a href="#" className="flex items-center px-4 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100 cursor-pointer">
<i className="fas fa-cog w-5 text-center"></i>
<span className="ml-3">Settings</span>
</a>
</li>
</ul>
{/* Integrated Apps */}
<div className="mt-8 px-6">
<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Integrated Apps</h3>
<ul className="space-y-2">
<li className="flex items-center text-gray-600 py-1.5 cursor-pointer">
<div className="w-6 h-6 rounded bg-yellow-500 flex items-center justify-center mr-3">
<i className="fas fa-brain text-xs text-white"></i>
</div>
<span className="text-sm">Therapy App</span>
</li>
<li className="flex items-center text-gray-600 py-1.5 cursor-pointer">
<div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center mr-3">
<i className="fab fa-paypal text-xs text-white"></i>
</div>
<span className="text-sm">PayPal App</span>
</li>
<li className="flex items-center text-gray-600 py-1.5 cursor-pointer">
<div className="w-6 h-6 rounded bg-red-500 flex items-center justify-center mr-3">
<i className="fab fa-youtube text-xs text-white"></i>
</div>
<span className="text-sm">YouTube</span>
</li>
</ul>
</div>
</nav>
{/* Bottom Button */}
<div className="p-4 border-t border-gray-200">
<button className="flex items-center justify-center w-full py-2 px-4 bg-blue-600 text-white rounded-lg !rounded-button whitespace-nowrap cursor-pointer">
<i className="fas fa-chart-line mr-2"></i>
<span>Improvements</span>
</button>
</div>
</div>
{/* Main Content */}
<div className="flex-1 flex flex-col h-full">
{/* Header */}
<div className="bg-white py-4 px-6 border-b border-gray-200 flex justify-between items-center">
<h1 className="text-xl font-semibold">Messages / Chat</h1>
</div>
{/* Message Content */}
<div className="flex-1 overflow-hidden">
{isMessageOpen ? (
<div className="flex h-full">
{/* Contacts List */}
<div className="w-72 border-r border-gray-700 overflow-y-auto">
<div className="p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
<div className="relative">
<input
type="text"
placeholder="Search..."
className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-600 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
/>
<i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
</div>
</div>
<div className="divide-y divide-gray-200">
<div className="p-3 hover:bg-gray-50 cursor-pointer">
<div className="flex items-start">
<img
src="https://readdy.ai/api/search-image?query=professional%20business%20portrait%20of%20a%20woman%20in%20corporate%20attire%20with%20neutral%20background%2C%20high%20quality%20headshot&width=40&height=40&seq=124&orientation=squarish"
alt="Jenny Wilson"
className="w-10 h-10 rounded-full object-cover"
/>
<div className="ml-3 flex-1">
<div className="flex justify-between">
<h3 className="font-medium">Jenny Wilson</h3>
<span className="text-xs text-gray-500">3 mins</span>
</div>
<p className="text-sm text-gray-500 truncate">Designer</p>
</div>
</div>
</div>
<div className="p-3 hover:bg-[#232738] cursor-pointer">
<div className="flex items-start">
<img
src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20eastern%20man%20with%20modern%20suit%2C%20corporate%20photo%20with%20dark%20blue%20background%2C%20high%20quality%20professional%20photo&width=40&height=40&seq=125&orientation=squarish"
alt="Cody Fisher"
className="w-10 h-10 rounded-full object-cover"
/>
<div className="ml-3 flex-1">
<div className="flex justify-between">
<h3 className="font-medium">Cody Fisher</h3>
<span className="text-xs text-gray-400">12 mins</span>
</div>
<p className="text-sm text-gray-400 truncate">Developer</p>
</div>
</div>
</div>
<div className="p-3 bg-[#232738] cursor-pointer">
<div className="flex items-start">
<img
src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20eastern%20man%20with%20beard%20and%20business%20attire%2C%20corporate%20photo%20with%20dark%20blue%20background%2C%20high%20quality%20professional%20photo&width=40&height=40&seq=126&orientation=squarish"
alt="Wade Warren"
className="w-10 h-10 rounded-full object-cover"
/>
<div className="ml-3 flex-1">
<div className="flex justify-between">
<h3 className="font-medium">Wade Warren</h3>
<span className="text-xs text-gray-400">30 mins</span>
</div>
<div className="relative group">
<p id="jobTitle" className="text-sm text-gray-400 truncate hover:text-blue-400 transition-colors">Marketing Manager</p>
<div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg p-4 hidden group-hover:block z-50">
<div className="text-gray-800">
<h4 className="font-semibold mb-2">Job Details</h4>
<div className="space-y-2 text-sm">
<p><span className="font-medium">Responsibilities:</span> Develop and implement marketing strategies, manage advertising campaigns, analyze data and optimize performance</p>
<p><span className="font-medium">Skills:</span> Digital Marketing, Social Media, Data Analytics, Project Management</p>
<p><span className="font-medium">Experience:</span> 5+ years in Digital Marketing</p>
</div>
<button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
View Full Profile
<i className="fas fa-arrow-right ml-1"></i>
</button>
</div>
<div className="absolute w-3 h-3 bg-white transform rotate-45 -top-1.5 left-4"></div>
</div>
</div>
</div>
</div>
</div>
<div className="p-3 hover:bg-[#232738] cursor-pointer">
<div className="flex items-start">
<img
src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20eastern%20woman%20with%20modern%20style%2C%20corporate%20photo%20with%20dark%20blue%20background%2C%20high%20quality%20professional%20photo&width=40&height=40&seq=127&orientation=squarish"
alt="Kristin Watson"
className="w-10 h-10 rounded-full object-cover"
/>
<div className="ml-3 flex-1">
<div className="flex justify-between">
<h3 className="font-medium">Kristin Watson</h3>
<span className="text-xs text-gray-400">1 hour</span>
</div>
<p className="text-sm text-gray-400 truncate">Product Manager</p>
</div>
</div>
</div>
<div className="p-3 hover:bg-[#232738] cursor-pointer">
<div className="flex items-start">
<img
src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20eastern%20man%20with%20glasses%20and%20formal%20attire%2C%20corporate%20photo%20with%20dark%20blue%20background%2C%20high%20quality%20professional%20photo&width=40&height=40&seq=128&orientation=squarish"
alt="Guy Hawkins"
className="w-10 h-10 rounded-full object-cover"
/>
<div className="ml-3 flex-1">
<div className="flex justify-between">
<h3 className="font-medium">Guy Hawkins</h3>
<span className="text-xs text-gray-400">2 hours</span>
</div>
<p className="text-sm text-gray-400 truncate">Analyst</p>
</div>
</div>
</div>
</div>
</div>
{/* Chat Area */}
<div className="flex-1 flex flex-col">
{/* Chat Header */}
<div className="p-4 border-b border-gray-700 flex justify-between items-center">
<div className="flex items-center">
<img
src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20eastern%20man%20with%20beard%20and%20business%20attire%2C%20corporate%20photo%20with%20dark%20blue%20background%2C%20high%20quality%20professional%20photo&width=40&height=40&seq=126&orientation=squarish"
alt="Wade Warren"
className="w-10 h-10 rounded-full object-cover"
/>
<div className="ml-3">
<h3 className="font-medium">وايد وارن</h3>
<p className="text-xs text-gray-400">آخر ظهور: 5 دقائق مضت</p>
</div>
</div>
<button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg !rounded-button whitespace-nowrap text-sm cursor-pointer">
<i className="fas fa-plus mr-1"></i>
Add Task
</button>
</div>
{/* Messages */}
<div className="flex-1 p-4 overflow-y-auto">
<div className="space-y-6">
{/* Received Message */}
<div className="flex items-end">
<img
src="https://readdy.ai/api/search-image?query=professional%20business%20portrait%20of%20a%20person%20in%20formal%20attire%20with%20neutral%20background%2C%20high%20quality%20headshot&width=32&height=32&seq=126&orientation=squarish"
alt="Wade Warren"
className="w-8 h-8 rounded-full object-cover"
/>
<div className="ml-2 max-w-[70%]">
<div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
<p className="text-sm">Is the work on the homepage design in progress?</p>
</div>
<p className="text-xs text-gray-500 mt-1">11:30 AM</p>
</div>
</div>
{/* Sent Message */}
<div className="flex items-end justify-end">
<div className="mr-2 max-w-[70%]">
<div className="bg-blue-600 p-3 rounded-lg rounded-br-none">
<p className="text-sm text-white">Yes, I just finished updating the design according to the latest feedback. I'll send you the link right away.</p>
</div>
<div className="flex justify-end mt-1">
<p className="text-xs text-gray-500">11:32 AM</p>
<i className="fas fa-check-double text-xs text-blue-500 ml-1"></i>
</div>
</div>
</div>
{/* Received Message */}
<div className="flex items-end">
<img
src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20eastern%20man%20with%20beard%20and%20business%20attire%2C%20corporate%20photo%20with%20dark%20blue%20background%2C%20high%20quality%20professional%20photo&width=32&height=32&seq=126&orientation=squarish"
alt="Wade Warren"
className="w-8 h-8 rounded-full object-cover"
/>
<div className="ml-2 max-w-[70%]">
<div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
<p className="text-sm">I think we should have an option to add links for users. Can you add that? It would be helpful for search.</p>
</div>
<p className="text-xs text-gray-500 mt-1">11:35 AM</p>
</div>
</div>
{/* Sent Message */}
<div className="flex items-end justify-end">
<div className="mr-2 max-w-[70%]">
<div className="bg-blue-600 p-3 rounded-lg rounded-br-none">
<p className="text-sm text-white">Sure, I'll add the links option with icons. How many links would you like per user?</p>
</div>
<div className="flex justify-end mt-1">
<p className="text-xs text-gray-500">11:40 AM</p>
<i className="fas fa-check-double text-xs text-blue-500 ml-1"></i>
</div>
</div>
</div>
{/* Received Message */}
<div className="flex items-end">
<img
src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20eastern%20man%20with%20beard%20and%20business%20attire%2C%20corporate%20photo%20with%20dark%20blue%20background%2C%20high%20quality%20professional%20photo&width=32&height=32&seq=126&orientation=squarish"
alt="Wade Warren"
className="w-8 h-8 rounded-full object-cover"
/>
<div className="ml-2 max-w-[70%]">
<div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
<p className="text-sm">I think three links would be enough. Can we also add an option to access the profile page?</p>
</div>
<p className="text-xs text-gray-500 mt-1">11:45 AM</p>
</div>
</div>
</div>
</div>
{/* Message Input */}
<div className="p-4 border-t border-gray-200">
<div className="flex items-center">
<div className="flex-1 relative">
<input
type="text"
placeholder="Type a message..."
className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-600 py-3 px-4 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
/>
<div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
<button className="text-gray-400 hover:text-gray-600 cursor-pointer">
<i className="far fa-smile"></i>
</button>
<button className="text-gray-400 hover:text-gray-600 cursor-pointer">
<i className="fas fa-paperclip"></i>
</button>
</div>
</div>
<button className="ml-3 bg-blue-600 text-white p-3 rounded-full !rounded-button cursor-pointer">
<i className="fas fa-paper-plane"></i>
</button>
</div>
</div>
</div>
</div>
) : (
<div className="flex items-center justify-center h-full">
<div className="text-center">
<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
<i className="fas fa-comments text-3xl text-gray-400"></i>
</div>
<h2 className="text-xl font-semibold mb-2">Message Center</h2>
<p className="text-gray-500 max-w-md">Click the "Messages" button in the sidebar to start conversations with your team</p>
<button
onClick={toggleMessage}
className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-lg !rounded-button whitespace-nowrap cursor-pointer"
>
<i className="fas fa-comment mr-2"></i>
Open Messages
</button>
</div>
</div>
)}
</div>
</div>
</div>
);
};
export default App
