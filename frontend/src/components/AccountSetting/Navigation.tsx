import { User, Settings, BellRing, AlarmCheck, Palette } from 'lucide-react';

interface NavigationProps {
  selectedView: string;
  onTabChange: (event: React.MouseEvent<HTMLElement>, view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ selectedView, onTabChange }) => {
  const navItems = [
    { icon: <User size={22} />, label: 'Account', view: 'Account' },
    { icon: <Settings size={22} />, label: 'Main settings', view: 'Main settings' },
    { icon: <BellRing size={22} />, label: 'Reminders', view: 'Reminders' },
    { icon: <AlarmCheck size={22} />, label: 'Notifications', view: 'Notifications' },
    
  ];

  return (
    <aside className="w-80 min-h-screen bg-gradient-to-b from-[#11132C] to-[#0E1122] p-6 text-white rounded-tr-2xl rounded-br-2xl shadow-lg">
      <h2 className="text-xl font-semibold mb-6 tracking-wide text-gray-300">Navigation</h2>
      
      <ul className="space-y-3">
        {navItems.map((item) => (
          <li key={item.view}>
            <button
              onClick={(e) => onTabChange(e, item.view)}
              className={`flex items-center gap-4 w-full py-2 px-3 rounded-lg transition-colors ${
                selectedView === item.view
                  ? 'bg-[#1f243c] text-blue-400 font-semibold'
                  : 'hover:bg-[#1c2033] text-gray-300'
              }`}
            >
              {item.icon}
              <span className="text-lg">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Navigation;
