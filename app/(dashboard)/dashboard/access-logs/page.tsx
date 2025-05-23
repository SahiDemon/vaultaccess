'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useAccessLogs } from '@/hooks/useAccessLogs';
import { Loader2, RefreshCw, CheckCircle, AlertCircle, Clock, Shield, User, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { LogEntry } from '@/components/log-entry';

export default function AccessLogsPage() {
  const { logs, loading, error, refreshLogs } = useAccessLogs();
  const [refreshing, setRefreshing] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshLogs();
    setTimeout(() => setRefreshing(false), 500);
  };

  // Check for screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  if (loading && !refreshing) {
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

  // Count logs by authentication method
  const methodCounts = logs.reduce((acc, log) => {
    acc[log.using] = (acc[log.using] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Count successes and failures
  const successCount = logs.filter(log => log.statusType === 'success').length;
  const failureCount = logs.filter(log => log.statusType === 'failed').length;

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Access Logs</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Access History
              </CardTitle>
              <CardDescription>
                Records of all system access attempts and authentication events
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="secondary" className="bg-green-900/20 text-green-500 border-green-800">
                <CheckCircle className="h-3 w-3 mr-1" /> {successCount} Granted
              </Badge>
              <Badge variant="secondary" className="bg-red-900/20 text-red-500 border-red-800">
                <AlertCircle className="h-3 w-3 mr-1" /> {failureCount} Denied
              </Badge>
            </div>
          </div>
          
          {logs.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {Object.entries(methodCounts).map(([method, count]) => {
                const isAdmin = method === 'ADMIN';
                const isClient = method === 'CLIENT';
                const isUser = method === 'USER';
                
                return (
                  <Badge 
                    key={method} 
                    variant="outline" 
                    className={`
                      ${isAdmin ? 'border-blue-800 bg-blue-900/20 text-blue-400' : ''}
                      ${isClient ? 'border-purple-800 bg-purple-900/20 text-purple-400' : ''}
                      ${isUser ? 'border-yellow-800 bg-yellow-900/20 text-yellow-400' : ''}
                      ${!isAdmin && !isClient && !isUser ? 'bg-gray-900 hover:bg-gray-800' : ''}
                    `}
                  >
                    {isAdmin && <User className="h-3 w-3 mr-1" />}
                    {method}: {count}
                  </Badge>
                );
              })}
            </div>
          )}
          
          <div className="mt-4 flex gap-2 justify-end">
            <Badge variant="outline" className="bg-gray-900">
              <Monitor className="h-3 w-3 mr-1 md:inline-block hidden" />
              <Smartphone className="h-3 w-3 mr-1 inline-block md:hidden" />
              {isSmallScreen ? 'Mobile View' : 'Desktop View'}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Desktop View (Table) */}
          {!isSmallScreen && (
            <div className="overflow-y-auto max-h-[600px] custom-scrollbar border border-gray-800 rounded-md">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow className="border-gray-800">
                    <TableHead className="w-16">ID</TableHead>
                    <TableHead>Authentication Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.length > 0 ? (
                    logs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-gray-900/50 border-gray-800">
                        <TableCell className="font-medium">{log.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {log.using === 'ADMIN' && (
                              <Badge variant="outline" className="border-blue-800 bg-blue-900/20 text-blue-400">
                                <User className="h-3 w-3 mr-1" /> Admin
                              </Badge>
                            )}
                            {log.using === 'CLIENT' && (
                              <Badge variant="outline" className="border-purple-800 bg-purple-900/20 text-purple-400">
                                <User className="h-3 w-3 mr-1" /> Client
                              </Badge>
                            )}
                            {log.using === 'USER' && (
                              <Badge variant="outline" className="border-yellow-800 bg-yellow-900/20 text-yellow-400">
                                <User className="h-3 w-3 mr-1" /> User
                              </Badge>
                            )}
                            {!['ADMIN', 'CLIENT', 'USER'].includes(log.using) && (
                              <div className="font-semibold">{log.using}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {log.statusType === 'success' ? (
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            ) : log.statusType === 'failed' ? (
                              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                            ) : (
                              <Clock className="h-4 w-4 text-blue-500 mr-2" />
                            )}
                            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                              log.statusType === 'success' ? 'bg-green-500/20 text-green-500 border border-green-800' : 
                              log.statusType === 'failed' ? 'bg-red-500/20 text-red-500 border border-red-800' : 
                              'bg-blue-500/20 text-blue-500 border border-blue-800'
                            }`}>
                              {log.formattedStatus || log.output}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-semibold">{log.formattedDate || 'Unknown'}</div>
                          <div className="text-xs text-muted-foreground">{log.formattedTime}</div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No logs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Mobile View (Cards) */}
          {isSmallScreen && (
            <div className="space-y-3 overflow-y-auto max-h-[600px] custom-scrollbar">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <LogEntry key={log.id} log={log} />
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No logs found
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 