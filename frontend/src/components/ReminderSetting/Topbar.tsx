// src/components/Topbar.tsx
'use client';

import { Search, Plus } from 'lucide-react';
import Image from 'next/image';

const Topbar = () => {
  return (
    <div className="w-full flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-[#111827]">
      {/* Page Title */}
      <h2 className=" font-semibold text-white text-3xl">
        Settings <span className="text-gray-400">/ Reminders</span>
      </h2>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Search Box */}
        <div className="relative">
  <input
    type="text"
    placeholder="Search..."
    className="pl-10 pr-4 rounded-md bg-[#1F2937] text-white placeholder-gray-400 focus:outline-none py-3 w-[300px] text-lg"
  />
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
</div>

        {/* New Task Button */}
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white  rounded-md  transition py-3 px-3 text-2xl">
          <Plus size={16} />
          New Task
        </button>

       {/* Profile Image */}
<div className="relative w-[120px] h-[120px] rounded-full overflow-hidden border border-gray-600">
  <Image
    src="https://i.pravatar.cc/150?img=52"
    alt="Profile"
    fill
    className="object-cover"
  />
</div>
      </div>
    </div>
  );
};

export default Topbar;
