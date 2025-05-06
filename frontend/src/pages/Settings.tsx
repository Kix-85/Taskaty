
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/AccountSetting/Navigation";
import AccountSetting from "@/components/AccountSetting/AccountSetting";
import MainSettings from "@/components/MainSettings/MainSettings";
import ReminderSetting from "@/components/ReminderSetting/ReminderSetting";
import NotificationSettings from "@/components/NotificationsSettings/NotificationSettings";
import { 
  User, 
  Settings as SettingsIcon, 
  BellRing, 
  AlarmClock 
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Navigate, Routes, Route, useLocation, useNavigate } from "react-router-dom";

export default function Settings() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    // Get active tab from URL path
    const path = location.pathname.split('/').pop();
    if (path === 'general') return 'general';
    if (path === 'notifications') return 'notifications';
    if (path === 'reminders') return 'reminders';
    return 'account'; // default
  });
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/settings/${value === 'account' ? '' : value}`);
  };
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 ml-0 md:ml-12 transition-all duration-300">
        <div className="hidden md:block">
          <Navigation />
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-screen-lg mx-auto">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            
            <Tabs 
              value={activeTab} 
              onValueChange={handleTabChange}
              className="md:hidden mb-6"
            >
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="account">
                  <User size={18} className="mr-2 md:hidden" />
                  <span className="hidden sm:inline">Account</span>
                </TabsTrigger>
                <TabsTrigger value="general">
                  <SettingsIcon size={18} className="mr-2 md:hidden" />
                  <span className="hidden sm:inline">General</span>
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <BellRing size={18} className="mr-2 md:hidden" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="reminders">
                  <AlarmClock size={18} className="mr-2 md:hidden" />
                  <span className="hidden sm:inline">Reminders</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Routes>
              <Route index element={<AccountSetting />} />
              <Route path="general" element={<MainSettings />} />
              <Route path="notifications" element={<NotificationSettings />} />
              <Route path="reminders" element={<ReminderSetting />} />
              <Route path="*" element={<Navigate replace to="/settings" />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
