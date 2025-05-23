import React from 'react';
import { Shield, Fingerprint } from 'lucide-react';

export function Logo({ size = 'default' }: { size?: 'small' | 'default' | 'large' }) {
  const sizeClasses = {
    small: 'h-8',
    default: 'h-12',
    large: 'h-16',
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Shield className={`${sizeClasses[size]} text-primary`} />
        <Fingerprint className={`${sizeClasses[size]} absolute top-0 left-0 text-blue-400 opacity-40`} />
      </div>
      <div className="font-bold tracking-tight">
        <span className="text-primary text-xl md:text-2xl">VAULT</span>
        <span className="text-blue-400 text-xl md:text-2xl">ACCESS</span>
      </div>
    </div>
  );
} 