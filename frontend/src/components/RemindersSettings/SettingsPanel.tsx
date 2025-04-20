'use client';

import {
  User,
  Settings,
  BellRing,
  AlarmCheck,
  Palette,
  Trash2,
  Save,
} from 'lucide-react';

export default function SettingsPanel() {
  const navItems = [
    { icon: <User size={24} />, label: 'Account' },
    { icon: <Settings size={24} />, label: 'Main settings' },
    { icon: <BellRing size={24} />, label: 'Reminders' },
    { icon: <AlarmCheck size={24} />, label: 'Notification' },
    { icon: <Palette size={24} />, label: 'Themes' },
  ];

  return (
    <div className="flex flex-1 p-6 gap-6 bg-[#0C0D1B]">
      {/* Sidebar */}
      <section className="w-80 bg-gradient-to-b from-[#11132C] to-[#0E1122] rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4 text-white">Navigation</h2>
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li
              key={item.label}
              className="text-white hover:text-blue-500 cursor-pointer text-2xl flex items-center gap-3"
            >
              {item.icon}
              {item.label}
            </li>
          ))}
        </ul>
      </section>

      {/* Main Panel */}
      <section className="flex-1 bg-gradient-to-b from-[#11132C] to-[#0E1122] rounded-2xl p-6 text-white">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <User size={28} />
          Account
        </h2>

        {/* Profile Info */}
        <div className="space-y-6">
          <div>
            <label className="block font-bold text-2xl mb-2">User name</label>
            <input
              type="text"
              defaultValue="Di Smolskii"
              className="w-full bg-[#4e538f] rounded-lg px-4 py-5 text-white text-xl"
            />
          </div>
          <div>
            <label className="block font-bold text-2xl mb-2">Email</label>
            <input
              type="email"
              defaultValue="di.smolskii@gmail.com"
              className="w-full bg-[#2d305e] rounded-lg px-4 py-5 text-white text-xl"
            />
          </div>
          <div>
            <label className="block font-bold text-2xl mb-2">Bio</label>
            <textarea
              defaultValue="Creative Product Designer with 7+ years of experience. Passionate about intuitive interfaces and user research, utilizing the latest design trends and technologies."
              className="w-full bg-[#6267a6] rounded-lg px-4 py-6 text-white text-xl"
              rows={5}
            ></textarea>
          </div>
        </div>

        {/* Delete Account */}
        <div className="mt-10">
          <p className="text-lg text-gray-400 mb-4">
            All your data, including tasks, projects, comments and more will be immediately deleted without the possibility of recovery.
          </p>
          <button className="bg-[#4047a3] px-2 py-4 rounded-lg flex items-center gap-3 text-white text-xl hover:bg-[#5059c5] transition">
            <Trash2 size={22} />
            Delete account
          </button>
        </div>

        {/* Save Button */}
        <div className="text-right mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-lg flex items-center gap-2 text-xl text-white transition">
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </section>
    </div>
  );
}
