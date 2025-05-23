'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Clock, User, Shield } from 'lucide-react';
import { AccessLog } from '@/hooks/useAccessLogs';

interface LogEntryProps {
  log: AccessLog;
  compact?: boolean;
}

export function LogEntry({ log, compact = false }: LogEntryProps) {
  // Authentication method badge
  const getAuthBadge = () => {
    const isAdmin = log.using === 'ADMIN';
    const isClient = log.using === 'CLIENT';
    const isUser = log.using === 'USER';
    
    if (isAdmin) {
      return (
        <Badge variant="outline" className="border-blue-800 bg-blue-900/20 text-blue-400">
          <Shield className="h-3 w-3 mr-1" /> Admin
        </Badge>
      );
    } else if (isClient) {
      return (
        <Badge variant="outline" className="border-purple-800 bg-purple-900/20 text-purple-400">
          <User className="h-3 w-3 mr-1" /> Client
        </Badge>
      );
    } else if (isUser) {
      return (
        <Badge variant="outline" className="border-yellow-800 bg-yellow-900/20 text-yellow-400">
          <User className="h-3 w-3 mr-1" /> User
        </Badge>
      );
    } else {
      return <span className="font-medium">{log.using}</span>;
    }
  };

  // Status indicator
  const getStatusBadge = () => {
    let icon;
    let badgeClass;
    
    if (log.statusType === 'success') {
      icon = <CheckCircle className="h-4 w-4 text-green-500 mr-2" />;
      badgeClass = 'bg-green-500/20 text-green-500 border border-green-800';
    } else if (log.statusType === 'failed') {
      icon = <AlertCircle className="h-4 w-4 text-red-500 mr-2" />;
      badgeClass = 'bg-red-500/20 text-red-500 border border-red-800';
    } else {
      icon = <Clock className="h-4 w-4 text-blue-500 mr-2" />;
      badgeClass = 'bg-blue-500/20 text-blue-500 border border-blue-800';
    }
    
    return (
      <div className="flex items-center">
        {icon}
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${badgeClass}`}>
          {log.formattedStatus || log.output}
        </span>
      </div>
    );
  };

  if (compact) {
    return (
      <div className="flex items-center justify-between border-b border-gray-800 py-2">
        <div className="flex items-center gap-2">
          {getAuthBadge()}
          {getStatusBadge()}
        </div>
        <div className="text-xs text-muted-foreground">{log.formattedTime}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-800 hover:bg-gray-900/50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="text-lg font-bold text-muted-foreground w-8">{log.id}</div>
        <div className="flex flex-col gap-1">
          <div>{getAuthBadge()}</div>
          <div>{getStatusBadge()}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold">{log.formattedDate || 'Unknown'}</div>
        <div className="text-xs text-muted-foreground">{log.formattedTime}</div>
      </div>
    </div>
  );
} 