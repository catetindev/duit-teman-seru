
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Eye, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const AdminSecurityPanel = () => {
  const [refreshing, setRefreshing] = useState(false);

  // Fetch recent security events
  const { data: securityEvents, isLoading, refetch } = useQuery({
    queryKey: ['admin-security-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .in('action', [
          'failed_login_attempt',
          'successful_login',
          'oauth_login_attempt',
          'oauth_login_error',
          'password_reset_request',
          'session_timeout',
          'rate_limit_exceeded'
        ])
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (error) throw error;
      return data;
    }
  });

  // Fetch audit logs
  const { data: auditLogs } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (error) throw error;
      return data;
    }
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      toast.success('Security data refreshed');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setRefreshing(false);
    }
  };

  const getEventTypeColor = (action: string) => {
    if (action.includes('failed') || action.includes('error')) return 'destructive';
    if (action.includes('success') || action.includes('login')) return 'default';
    if (action.includes('reset') || action.includes('timeout')) return 'secondary';
    return 'outline';
  };

  const getEventIcon = (action: string) => {
    if (action.includes('failed') || action.includes('error')) return <AlertTriangle className="h-4 w-4" />;
    return <Shield className="h-4 w-4" />;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Security Dashboard</h2>
        <Button 
          onClick={handleRefresh} 
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Security Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Recent Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {securityEvents?.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="mt-0.5">
                      {getEventIcon(event.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getEventTypeColor(event.action)} className="text-xs">
                          {event.action.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimeAgo(event.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        User ID: {event.user_id?.slice(0, 8)}...
                      </p>
                    </div>
                  </div>
                )) || []}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Audit Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Admin Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {auditLogs?.map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="mt-0.5">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {log.action}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(log.created_at || '')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Admin: {log.admin_user_id?.slice(0, 8)}...
                    </p>
                    {log.target_user_id && (
                      <p className="text-sm text-muted-foreground">
                        Target: {log.target_user_id.slice(0, 8)}...
                      </p>
                    )}
                  </div>
                </div>
              )) || []}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {securityEvents?.filter(e => e.action === 'failed_login_attempt').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Failed Login Attempts</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {securityEvents?.filter(e => e.action === 'successful_login').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Successful Logins</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {securityEvents?.filter(e => e.action === 'password_reset_request').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Password Resets</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {auditLogs?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Admin Actions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminSecurityPanel;
