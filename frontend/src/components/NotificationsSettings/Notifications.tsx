'use client';

import { Bell, Mail, Smartphone } from 'lucide-react';

const notifications = [
  'Comments for you',
  'Tasks assigned to you',
  'Completed tasks',
  'Uncompleted tasks',
  'Mentions in comments',
  'Project invitation accepted',
  'Project invitation declined',
  'Member left the project',
  'Member removed',
];

const toggles = [
  { label: 'Daily summary', checked: true },
  { label: 'Tips and tricks', checked: true },
  { label: 'Notification of new accounts', checked: false },
];

export default function NotificationsPanel() {
  return (
    <section className="w-full h-full p-6 md:p-10 bg-gradient-to-br from-[#5a56a8] to-[#0D1122] rounded-3xl text-white shadow-xl overflow-y-auto">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 text-3xl">
        <Bell size={24} className="text-yellow-400" />
        <h1 className="text-2xl font-semibold">Notifications</h1>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 p-4 bg-[#0A0E1E] rounded-xl mb-4 text-base sm:text-lg font-semibold text-center">
        <div className="text-left md:text-center flex justify-center items-center gap-2 ">
        <Bell size={20} className="text-yellow-400" />
            Notifications in the project
            
            </div>
        <div className="flex justify-center items-center gap-2">
          <Mail size={20} className="text-yellow-400"/> Email
        </div>
        <div className="flex justify-center items-center gap-2">
          <Smartphone size={20} className="text-yellow-400"/> Mobile device
        </div>
      </div>

      {/* Notification Rows */}
      <div className="space-y-3">
        {notifications.map((text, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-3 items-center text-sm sm:text-base bg-[#0A0E1E] rounded-lg px-4 py-3"
          >
            <div className="mb-2 md:mb-0 break-words">{text}</div>
            <div className="flex justify-start md:justify-center mb-2 md:mb-0">
              <input type="checkbox" defaultChecked className="accent-blue-900 w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex justify-start md:justify-center">
              <input type="checkbox" defaultChecked className="accent-blue-900 w-5 h-5 md:w-6 md:h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Account & Email Notifications */}
      <div className="text-xl text-gray-400 font-semibold mt-8 border-t border-[#1C223B] pt-6">
        Account and Email Notifications
      </div>

      <div className="space-y-4 mt-4">
        {toggles.map(({ label, checked }, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-[#0A0E1E] p-3 rounded-lg text-sm sm:text-base"
          >
            <span className="text-white">{label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={checked} className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-600 rounded-full peer peer-checked:bg-blue-600" />
              <div className="absolute left-1 top-1 w-3.5 h-3.5 bg-white rounded-full transition-transform peer-checked:translate-x-full" />
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}
