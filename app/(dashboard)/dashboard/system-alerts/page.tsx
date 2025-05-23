'use client';

import SystemAlerts from './component';

export default function SystemAlertsPage() {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">System Alerts</h1>
        <p className="text-muted-foreground">View and manage system notifications and events.</p>
      </div>
      
      <SystemAlerts />
    </div>
  );
} 