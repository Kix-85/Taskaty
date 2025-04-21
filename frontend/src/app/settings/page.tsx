// src/app/settings/page.tsx

'use client';

import { useState } from "react";
import Navigation from "@/components/AccountSetting/Navigation";
import AccountSetting from "@/components/AccountSetting/AccountSetting";
import ReminderSetting from "@/components/ReminderSetting/RemindersSetting";
import MainSettings from "@/components/MainSettings/Mainpannel";
import NotificationSettings from "@/components/NotificationsSettings/NotificationsSettings";
export default function SettingsPage() {
  const [selectedView, setSelectedView] = useState('Account');

  const handleTabChange = (event: React.MouseEvent<HTMLElement>, view: string) => {
    setSelectedView(view);
  };

  return (
    <div className="flex min-h-screen bg-[#16182b] w-full">
      {/* Sidebar */}
      <Navigation selectedView={selectedView} onTabChange={handleTabChange} />

      {/* Content Panel */}
      <div className="flex-1 p-6">
        {selectedView === 'Account' && <AccountSetting />}
        {selectedView === 'Reminders' && <ReminderSetting />}
        {selectedView === 'Main settings' && <MainSettings />}
        {selectedView === 'Notifications' && <NotificationSettings />}
        {/* Add other panels like Main settings, Notification, etc. here */}
      </div>
    </div>
  );
}
