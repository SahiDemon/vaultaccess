'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ShieldAlert, Settings, UserPlus, FileText, LogOut, User, Bell } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useUser } from '@/contexts/user-context';
import { supabase } from '@/lib/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function Sidebar() {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!user?.email) return 'VA';
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col h-screen w-64 border-r border-gray-800 bg-gray-950 text-white">
      <div className="py-4 px-4 pb-0">
        <Logo />
      </div>
      
      {/* User section */}
      {user && (
        <div className="px-4 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="font-medium truncate">{user.email}</p>
              <p className="text-xs text-gray-400 truncate">
                {user.user_metadata?.full_name || 'Vault User'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <nav className="flex flex-col gap-1.5 flex-1 p-2">
        <NavItem href="/dashboard" icon={<Home size={18} />} label="Overview" />
        <NavItem href="/dashboard/access-logs" icon={<FileText size={18} />} label="Access Logs" />
        <NavItem href="/dashboard/system-alerts" icon={<Bell size={18} />} label="System Alerts" />
        <NavItem href="/dashboard/access-control" icon={<ShieldAlert size={18} />} label="Access Control" />
        <NavItem href="/dashboard/add-face" icon={<UserPlus size={18} />} label="Add New Face" />
        <NavItem href="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />
      </nav>
      
      <div className="border-t border-gray-800 p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors text-gray-300 hover:text-white">
      <div>{icon}</div>
      <span>{label}</span>
    </Link>
  );
} 