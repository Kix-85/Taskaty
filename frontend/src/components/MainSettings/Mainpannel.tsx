'use client';

import {
  Globe,
  Clock,
  CalendarDays,
  ChevronDown,
  Laptop2,
  Smartphone,
  Settings,
} from 'lucide-react';
import { useState } from 'react';

const MainSettings = () => {
  const [computerSound, setComputerSound] = useState(true);
  const [mobileSound, setMobileSound] = useState(true);

  return (
    <section className="overflow-auto w-full h-full p-6 md:p-10 bg-gradient-to-br from-[#5a56a8] to-[#0D1122] rounded-3xl text-white shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 text-3xl">
        <Settings size={22} className="text-white" />
        <h1 className="text-2xl font-semibold">Main Settings</h1>
      </div>

      {/* Language */}
      <div className="mb-6">
        <h2 className="text-lg text-gray-400 mb-2">Language</h2>
        <div className="relative">
          <select className="w-full bg-[#0A0E1E] text-white p-3 rounded-lg border border-[#1C223B] appearance-none pr-10 text-xl py-5">
            <option>English</option>
            <option>German</option>
            <option>Spanish</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {/* Date & Time */}
      <div className="border-t border-[#1C223B] pt-6 mt-6 grid gap-6">
        <h2 className="text-xl text-gray-400">Date & Time</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xl mb-2">Time zone</label>
            <div className="relative">
              <select className="w-full bg-[#0A0E1E] text-white p-3 rounded-lg border border-[#1C223B] pr-10 appearance-none text-xl">
                <option>Europe / Berlin</option>
                <option>UTC</option>
                <option>Asia / Tokyo</option>
              </select>
              <Globe className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          <div>
            <label className="block text-xl mb-2">Time format</label>
            <div className="relative">
              <select className="w-full bg-[#0A0E1E] text-white p-3 rounded-lg border border-[#1C223B] pr-10 appearance-none text-xl">
                <option>1:00 pm</option>
                <option>13:00</option>
              </select>
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" size={20} />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xl mb-2">Date format</label>
            <div className="relative">
              <select className="w-full bg-[#0A0E1E] text-white p-3 rounded-lg border border-[#1C223B] pr-10 appearance-none text-xl">
                <option>dd-mm-yyyy</option>
                <option>mm-dd-yyyy</option>
                <option>yyyy-mm-dd</option>
              </select>
              <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          <div>
            <label className="block text-xl mb-2">Beginning of the week</label>
            <div className="relative">
              <select className="w-full bg-[#0A0E1E] text-white p-3 rounded-lg border border-[#1C223B] pr-10 appearance-none text-xl">
                <option>Monday</option>
                <option>Sunday</option>
              </select>
              <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Sound of task completion */}
      <div className="border-t border-[#1C223B] pt-6 mt-6">
        <h2 className="text-2xl text-gray-400 mb-2">Sound of task completion</h2>
        <p className="text-2xl text-gray-500 mb-4">Sound signal when task is completed.</p>
        <div className="flex flex-col md:flex-row gap-4">
          {/* Computer Toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={computerSound}
                onChange={() => setComputerSound(!computerSound)}
              />
              <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${computerSound ? 'bg-blue-600' : 'bg-gray-600'}`} />
              <div
                className={`absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-transform duration-300 ${
                  computerSound ? 'translate-x-5' : ''
                }`}
              />
            </label>
            <Laptop2 size={20} />
            <label className="text-lg">Computer and Web</label>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={mobileSound}
                onChange={() => setMobileSound(!mobileSound)}
              />
              <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${mobileSound ? 'bg-blue-600' : 'bg-gray-600'}`} />
              <div
                className={`absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-transform duration-300 ${
                  mobileSound ? 'translate-x-5' : ''
                }`}
              />
            </label>
            <Smartphone size={18} />
            <label className="text-lg">Mobile device</label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainSettings;
