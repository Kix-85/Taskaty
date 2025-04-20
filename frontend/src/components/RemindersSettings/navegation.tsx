import {
    User,
    Settings,
    BellRing,
    AlarmCheck,
    Palette,
   
  } from 'lucide-react';
  
  export default function SettingsPanel() {
    const navItems = [
      { icon: <User size={27} />, label: 'Account' },
      { icon: <Settings size={24} />, label: 'Main settings' },
      { icon: <BellRing size={24} />, label: 'Reminders' },
      { icon: <AlarmCheck size={24} />, label: 'Notification' },
      { icon: <Palette size={24} />, label: 'Themes' },
    ];
  
    return (
      <div className="flex   gap-2 bg-[#16182b]">
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
        </div>
    );}