'use client';

import { useState } from 'react';
import { Bell, Monitor, Smartphone, Mail } from 'lucide-react';

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <div
    onClick={onChange}
    className={`w-14 h-7 flex items-center rounded-full cursor-pointer transition-colors ${
      enabled ? 'bg-blue-600' : 'bg-gray-500'
    }`}
  >
    <div
      className={`h-6 w-6 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${
        enabled ? 'translate-x-7' : 'translate-x-1'
      }`}
    />
  </div>
);

const Reminders = () => {
  const [desktopNotif, setDesktopNotif] = useState(true);
  const [mobileNotif, setMobileNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);

  return (
    <section className="w-full h-full max-w-full overflow-x-hidden overflow-y-auto p-6 sm:p-8 md:p-10 bg-gradient-to-br from-[#5a56a8] to-[#0D1122] rounded-3xl text-white shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Bell size={34} className="text-white" />
        <h1 className="text-3xl sm:text-4xl font-bold">Reminders</h1>
      </div>

      {/* Lead Time Selector */}
      <div className="mb-10">
        <label className="block text-2xl font-semibold mb-4">
          Sound signal when task is completed.
        </label>
        <select className="w-full bg-[#13152b] border border-gray-600 text-white p-4 rounded-lg text-2xl">
          <option>Lead time</option>
        </select>
        <p className="text-xl text-gray-300 mt-3">
          If this feature is enabled, a reminder will be added by default before the task is due.
        </p>
      </div>

      {/* Notification Method */}
      <div className="border-t border-gray-700 pt-8 mt-10 space-y-8">
        <p className="text-3xl font-semibold mb-4">What method of reminder do you prefer?</p>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 text-2xl">
            <Monitor size={32} className="text-yellow-400" />
            <span>Notifications on your computer</span>
          </div>
          <ToggleSwitch enabled={desktopNotif} onChange={() => setDesktopNotif(!desktopNotif)} />
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 text-2xl">
            <Smartphone size={32} className="text-yellow-400" />
            <span>Notification on mobile</span>
          </div>
          <ToggleSwitch enabled={mobileNotif} onChange={() => setMobileNotif(!mobileNotif)} />
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 text-2xl">
            <Mail size={32} className="text-yellow-400" />
            <span>Email</span>
          </div>
          <ToggleSwitch enabled={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="border-t border-gray-700 pt-8 mt-14 space-y-3 text-gray-300">
        <p className="text-3xl font-bold mb-3">Reminders not working?</p>
        <ul className="list-disc pl-6 space-y-2 text-2xl">
          <li>Make sure your device settings allow notifications from AI-Task.</li>
          <li>
            Check if your device is in Do Not Disturb mode. Add AI-Task to your allowed apps list.
          </li>
          <li>
            Still need help? Visit our{' '}
            <span className="text-blue-400 underline cursor-pointer">troubleshooting guide</span>.
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Reminders;
