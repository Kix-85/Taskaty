// src/components/RemindersPanel.tsx
'use client';

import { Mail, Bell, CreditCard } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';

const RemindersPanel = () => {
  return (
    <div className="flex flex-col gap-6 bg-[#1F2937] p-6 rounded-lg w-full py-30 px-20 text-3xl space-y-4">
      <h3 className=" font-semibold text-white text-5xl">Reminders</h3>

      <ReminderRow
        icon={<Mail className="text-blue-500" size={40} />}
        title="Email Notification"
        description="Receive daily updates via email about your tasks."
      />

      <ReminderRow 
        icon={<Bell className=" text-yellow-400 " size={40} />}
        title="Push Notification"
        description="Get real-time push notifications on your device."
      />

      <ReminderRow
        icon={<CreditCard className="text-green-400" size={40} />}
        title="Payment Reminder"
        description="Get notified before your payment dates."
      />
    </div>
  );
};

const ReminderRow = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex items-center justify-between border-b border-gray-700 pb-4 py-10">
    <div className="flex items-start gap-3">
      <div className="mt-1">{icon}</div>
      <div>
        <h4 className="text-white font-medium">{title}</h4>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
    <ToggleSwitch />
  </div>
);

export default RemindersPanel;
