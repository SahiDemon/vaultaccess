'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAccessControl } from '@/hooks/useAccessControl';
import { Loader2 } from 'lucide-react';

export default function AccessControlPage() {
  const { editData, loading, error, updateRFIDStatus, updateFingerprintStatus } = useAccessControl();

  const handleRFIDToggle = async (checked: boolean) => {
    await updateRFIDStatus(checked);
  };

  const handleFingerprintToggle = async (checked: boolean) => {
    await updateFingerprintStatus(checked);
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Access Control</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>RFID Access Control</CardTitle>
            <CardDescription>
              Enable or disable RFID card access. When enabled, new RFID cards can be registered to the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch 
                id="rfid-mode" 
                checked={editData?.RFID || false}
                onCheckedChange={handleRFIDToggle}
              />
              <Label htmlFor="rfid-mode">
                {editData?.RFID ? 'RFID Registration Enabled' : 'RFID Registration Disabled'}
              </Label>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Fingerprint Access Control</CardTitle>
            <CardDescription>
              Enable or disable fingerprint access. When enabled, new fingerprints can be registered to the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch 
                id="fingerprint-mode" 
                checked={editData?.FINGERPRINT || false}
                onCheckedChange={handleFingerprintToggle}
              />
              <Label htmlFor="fingerprint-mode">
                {editData?.FINGERPRINT ? 'Fingerprint Registration Enabled' : 'Fingerprint Registration Disabled'}
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 