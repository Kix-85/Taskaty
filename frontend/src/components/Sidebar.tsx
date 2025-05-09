import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Home, 
  CheckSquare, 
  Folder, 
  MessageSquare, 
  Settings,
  Menu,
  X,
  ChevronDown,
  FileText,
  Layers,
  HelpCircle,
  Sliders,
  Flag,
  LogOut,
  ChevronRight,
  ChevronLeft
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const navItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: CheckSquare, label: "My Tasks", href: "/myTasks" },
  { icon: Folder, label: "Projects", href: "/projects" },
  { 
    icon: MessageSquare, 
    label: "Messages", 
    href: "/messages",
    badge: "6"
  },
  { 
    icon: Settings, 
    label: "Settings", 
    href: "/settings"
  }
];

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  }, [collapsed, isMobile, mobileOpen]);

  // Mobile toggle button
  const MobileToggle = () => (
    <button
      onClick={toggleSidebar}
      className="fixed top-1/2 -translate-y-1/2 left-0 z-50 inline-flex items-center justify-center w-6 h-12 text-sm text-gray-500 rounded-r-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 bg-white dark:bg-gray-800 shadow-md"
    >
      <span className="sr-only">Toggle sidebar</span>
      {mobileOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
    </button>
  );

  // Determine if sidebar should be shown
  const showSidebar = !isMobile || (isMobile && mobileOpen);

  return (
    <>
      <MobileToggle />
      <aside
        className={cn(
          "h-screen transition-all duration-300",
          showSidebar ? "translate-x-0" : "-translate-x-full",
          "sm:translate-x-0",
          collapsed ? "w-16" : "w-64",
          "fixed sm:relative z-50",
          className
        )}
        aria-label="Sidebar"
      >
        <div className="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className={cn(
            "flex items-center justify-between mb-5",
            collapsed && "flex-col gap-2"
          )}>
            {!collapsed && (
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Taskaty</h1>
            )}
            <div className={cn(
              "flex items-center gap-2",
              collapsed && "flex-col"
            )}>
              <ThemeToggle />
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  onClick={toggleSidebar}
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group",
                    location.pathname === item.href && "bg-gray-100 dark:bg-gray-700"
                  )}
                >
                  <item.icon className="w-6 h-6 text-gray-400 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
                  {!collapsed && (
                    <>
                      <span className="ml-3">{item.label}</span>
                      {item.badge && (
                        <span className="inline-flex justify-center items-center w-5 h-5 text-xs font-semibold rounded-full text-primary-800 bg-primary-100 dark:bg-primary-200 dark:text-primary-800">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={cn(
          "hidden absolute bottom-0 left-0 justify-center p-4 w-full lg:flex bg-white dark:bg-gray-800 z-20 border-r border-gray-200 dark:border-gray-700",
          collapsed ? "flex-col space-y-4" : "space-x-4"
        )}>
          <Button variant="ghost" size="icon">
            <Sliders className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <Flag className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <LogOut className="w-6 h-6" />
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
