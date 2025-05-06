
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  User, 
  Settings, 
  BellRing, 
  AlarmClock, 
  ChevronRight
} from "lucide-react";

type NavigationItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
};

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navigationItems: NavigationItem[] = [
    {
      id: "account",
      label: "Account",
      icon: <User size={20} />,
      path: "/settings",
    },
    {
      id: "general",
      label: "General Settings",
      icon: <Settings size={20} />,
      path: "/settings/general",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <BellRing size={20} />,
      path: "/settings/notifications",
    },
    {
      id: "reminders",
      label: "Reminders",
      icon: <AlarmClock size={20} />,
      path: "/settings/reminders",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/settings" && location.pathname === "/settings") {
      return true;
    }
    return location.pathname === path;
  };

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "h-full bg-card transition-all duration-300 ease-in-out border-r border-border",
        collapsed ? "w-16" : "w-64",
        "md:block hidden"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <h2 className="text-lg font-semibold">Settings</h2>
        )}
        <button
          onClick={toggleCollapse}
          className={cn(
            "p-1 rounded-full hover:bg-accent transition-all",
            collapsed && "mx-auto"
          )}
        >
          <ChevronRight
            size={20}
            className={cn(
              "transition-transform",
              collapsed ? "" : "rotate-180"
            )}
          />
        </button>
      </div>

      <nav className="p-2 space-y-1">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={cn(
              "w-full flex items-center p-2 rounded-md transition-all duration-200",
              "hover:bg-accent/80 focus:outline-none",
              isActive(item.path)
                ? "bg-primary text-primary-foreground"
                : "text-foreground/80",
              collapsed ? "justify-center" : "justify-start"
            )}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <span className="ml-3 text-sm font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}
