'use client';

import { useState } from 'react';
import { Bell, Monitor, Smartphone, Mail } from 'lucide-react';

const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <div
    onClick={onChange}
    className={`w-12 h-6 flex items-center rounded-full cursor-pointer transition-colors ${
      enabled ? 'bg-blue-600' : 'bg-gray-500'
    }`}
  >
    <div
      className={`h-5 w-5 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </div>
);

const Reminders = () => {
  const [desktopNotif, setDesktopNotif] = useState(true);
  const [mobileNotif, setMobileNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);

  return (
    <section className="w-full h-full p-6 md:p-10 bg-gradient-to-br from-[#5a56a8] to-[#0D1122] rounded-3xl text-white shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Bell size={30} className="text-white" />
        <h1 className="text-2xl md:text-3xl font-semibold">Reminders</h1>
      </div>

      {/* Lead Time Selector */}
      <div className="mb-6">
        <label className="block text-2xl md:text-base  mb-6">
          Sound signal when task is completed.
        </label>
        <select className="w-full bg-[#13152b] border border-gray-600 text-white p-3 rounded-lg text-2xl py-5">
          <option>lead time</option>
        </select>
        <p className="text-lg text-gray-400 mt-2">
          If this feature is enabled, a reminder will be added by default before the task is due.
        </p>
      </div>

      {/* Notification Method */}
      <div className="border-t border-gray-700 pt-6 mt-6 space-y-6">
        <p className="text-2xl font-semibold mb-2">What method of reminder do you prefer?</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xl ">
            <Monitor size={30} />
            <span>Notifications on your computer</span>
          </div>
          <ToggleSwitch enabled={desktopNotif} onChange={() => setDesktopNotif(!desktopNotif)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xl">
            <Smartphone size={30} color='yellow' />
            <span>Notification on mobile</span>
          </div>
          <ToggleSwitch enabled={mobileNotif} onChange={() => setMobileNotif(!mobileNotif)} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xl">
            <Mail size={30} color='yellow' />
            <span>Email</span>
          </div>
          <ToggleSwitch enabled={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="border-t border-gray-700 pt-6 mt-10 text-sm space-y-2 text-gray-300">
        <p className="text-3xl mb-2">Reminders not working?</p>
        <ul className="list-disc pl-5 space-y-1 text-2xl">
          <li>Make sure your device settings allow you to receive notifications from AI-Task.</li>
          <li>
            Check if your device is in Do Not Disturb mode. To receive notifications, turn it off
            or add AI-Task to your Allowed Apps list.
          </li>
          <li>
            Still need help? Check out our <span className="text-blue-400 underline cursor-pointer">troubleshooting guide</span>.
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Reminders;
