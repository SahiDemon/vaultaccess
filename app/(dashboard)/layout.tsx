import React from 'react';
import { Sidebar } from '@/components/sidebar';
import AuthCheck from '@/components/auth-check';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthCheck>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 mx-auto">
          {children}
        </main>
      </div>
    </AuthCheck>
  );
} 