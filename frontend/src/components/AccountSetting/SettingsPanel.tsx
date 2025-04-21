'use client';

import {
  User,
  Trash2,
  Save,
} from 'lucide-react';

export default function SettingsPanel() {
  return (
    <div className="w-full h-full p-6 md:p-10 bg-gradient-to-br from-[#5a56a8] to-[#0D1122] rounded-3xl text-white shadow-xl">
      {/* Header */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-3">
        <User size={28} />
        Account
      </h2>

      {/* Profile Info */}
      <div className="space-y-6">
        {/* Username */}
        <div>
          <label className="block font-semibold text-xl mb-2">User name</label>
          <input
            type="text"
            defaultValue="Di Smolskii"
            className="w-full bg-[#0a0b20] rounded-lg px-4 py-4 text-white text-base sm:text-lg"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold text-xl mb-2">Email</label>
          <input
            type="email"
            defaultValue="di.smolskii@gmail.com"
            className="w-full bg-[#0a0b20] rounded-lg px-4 py-4 text-white text-base sm:text-lg"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block font-semibold text-xl mb-2">Bio</label>
          <textarea
            defaultValue="Creative Product Designer with 7+ years of experience. Passionate about intuitive interfaces and user research, utilizing the latest design trends and technologies."
            className="w-full bg-[#0d113c] rounded-lg px-4 py-4 text-white text-base sm:text-lg resize-none max-h-48 overflow-y-auto"
            rows={5}
          />
        </div>
      </div>

      {/* Delete Account */}
      <div className="mt-10">
        <p className="text-sm sm:text-base text-gray-400 mb-4">
          All your data, including tasks, projects, comments and more will be immediately deleted without the possibility of recovery.
        </p>
        <button className="bg-[#4047a3] px-4 py-3 rounded-lg flex items-center gap-2 text-sm sm:text-lg hover:bg-[#5059c5] transition">
          <Trash2 size={20} />
          Delete account
        </button>
      </div>

      {/* Save Button */}
      <div className="text-right mt-8">
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 sm:py-4 rounded-lg flex items-center gap-2 text-sm sm:text-lg transition">
          <Save size={20} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
