
import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopbar } from './DashboardTopbar';
import { SidebarProvider } from '@/components/ui/sidebar';

export const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="dashboard-layout flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardTopbar />
          <main className="flex-1 p-4 sm:p-6 overflow-auto">
            <div className="w-full max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
