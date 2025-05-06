
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
  X
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: CheckSquare, label: "My Tasks", href: "/myTasks" },
  { icon: Folder, label: "Projects", href: "/projects" },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: Settings, label: "Settings", href: "/settings" },
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
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden fixed top-4 left-4 z-50 bg-primary text-primary-foreground hover:bg-primary/90"
      onClick={toggleSidebar}
    >
      {mobileOpen ? <X size={20} /> : <Menu size={20} />}
    </Button>
  );

  // Determine if sidebar should be shown
  const showSidebar = !isMobile || (isMobile && mobileOpen);

  return (
    <>
      <MobileToggle />
      <aside
        className={cn(
          "z-40 transition-all duration-300 ease-in-out",
          showSidebar ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-16" : "w-64",
          className
        )}
      >
        <div className="flex flex-col h-full bg-sidebar">
          <div className="flex items-center justify-between p-3 border-b border-sidebar-border">
            {!collapsed && (
              <h1 className="text-xl font-bold text-sidebar-foreground">Taskaty</h1>
            )}
            <div className="flex items-center">
              <ThemeToggle />
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sidebar-foreground hover:bg-sidebar-accent ml-1"
                  onClick={toggleSidebar}
                >
                  <Menu size={20} />
                </Button>
              )}
            </div>
          </div>
          
          <nav className="flex-1 px-1 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  "sidebar-link",
                  !collapsed ? "px-3 py-2" : "justify-center px-2 py-2",
                  location.pathname === item.href && "active"
                )}
                title={collapsed ? item.label : ""}
              >
                <item.icon size={20} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
          
          <div className="p-3 border-t border-sidebar-border">
            <div className={cn(
              "flex items-center gap-2 text-sidebar-foreground/70",
              collapsed && "justify-center"
            )}>
              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                U
              </div>
              {!collapsed && <span className="font-medium">User</span>}
            </div>
          </div>
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
