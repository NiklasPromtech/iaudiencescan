import { ReactNode, useState, useCallback } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { WebsiteSelector } from "./WebsiteSelector";

const SIDEBAR_KEY = "sidebar-open";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [open, setOpen] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    return stored === null ? false : stored === "true";
  });

  const handleOpenChange = useCallback((value: boolean) => {
    setOpen(value);
    localStorage.setItem(SIDEBAR_KEY, String(value));
  }, []);

  return (
    <SidebarProvider open={open} onOpenChange={handleOpenChange}>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/80 backdrop-blur-sm sticky top-0 z-20">
            <SidebarTrigger className="mr-4" />
            <WebsiteSelector />
          </header>
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
