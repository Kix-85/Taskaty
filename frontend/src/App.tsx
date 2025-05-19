import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import Auth from '@/pages/Auth';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import MyTasks from '@/pages/MyTasks';
import Projects from '@/pages/Projects';
import Messages from '@/pages/messages';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import { Sidebar } from '@/components/Sidebar';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/contexts/ThemeContext";
import VerifyEmail from "./pages/verifyEmail";
import { ChatBotProvider } from '@/providers/ChatBotProvider';
import ProtectedRoute from '@/components/protectRoute';

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthPage = location.pathname === "/auth";
  const isVerifyPage = location.pathname === "/verify-email";

  useEffect(() => {
    const initializeAuth = async () => {
      const user = await authService.initializeAuth();
      if (user) {
        setUser(user);
      }
    };

    initializeAuth();
  }, [setUser]);

  return (
    <div className="flex h-screen">
      {!isAuthPage && !isVerifyPage && <Sidebar />}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myTasks"
            element={
              <ProtectedRoute>
                <MyTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings/*"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Default Routes */}
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <ChatBotProvider>
            <BrowserRouter>
              <Toaster position="top-right" />
              <AppContent />
            </BrowserRouter>
          </ChatBotProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
