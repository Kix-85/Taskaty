
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import "@/app/globals.css";

// Create a client
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div className="flex min-h-screen bg-background">
              <Sidebar />
              <main className="flex-1 ml-0 md:ml-12 transition-all duration-300">
                {children}
              </main>
            </div>
          </TooltipProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}

export const metadata = {
  title: 'Taskaty',
  description: 'A task management application',
};
