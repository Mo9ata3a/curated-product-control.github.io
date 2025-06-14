
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, Eye, Activity } from 'lucide-react';

interface SecurityEvent {
  id: string;
  table_name: string;
  operation: string;
  user_email: string | null;
  old_data: any;
  new_data: any;
  created_at: string;
}

export const SecurityMonitor = () => {
  const { data: securityEvents, isLoading } = useQuery({
    queryKey: ['security-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .eq('operation', 'SECURITY_EVENT')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        throw error;
      }
      
      return data as SecurityEvent[];
    },
    refetchInterval: 30000, // Actualiser toutes les 30 secondes
  });

  const { data: recentActivity } = useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_log')
        .select('operation, created_at')
        .neq('operation', 'SECURITY_EVENT')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      return data;
    },
  });

  const getEventSeverity = (eventType: string) => {
    switch (eventType) {
      case 'FAILED_LOGIN':
        return 'high';
      case 'UNAUTHORIZED_ACCESS':
        return 'critical';
      case 'SUSPICIOUS_ACTIVITY':
        return 'medium';
      default:
        return 'low';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Monitoring de sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chargement des événements de sécurité...</p>
        </CardContent>
      </Card>
    );
  }

  const stats = {
    totalEvents: securityEvents?.length || 0,
    criticalEvents: securityEvents?.filter(e => 
      getEventSeverity(e.old_data?.event_type) === 'critical'
    ).length || 0,
    recentActivity: recentActivity?.length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Statistiques de sécurité */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Événements de sécurité</p>
                <p className="text-2xl font-bold">{stats.totalEvents}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Incidents critiques</p>
                <p className="text-2xl font-bold text-red-500">{stats.criticalEvents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Activité (24h)</p>
                <p className="text-2xl font-bold">{stats.recentActivity}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des événements de sécurité */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Événements de sécurité récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!securityEvents || securityEvents.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-gray-500">Aucun événement de sécurité détecté</p>
              <p className="text-sm text-gray-400">Votre système fonctionne normalement</p>
            </div>
          ) : (
            <div className="space-y-4">
              {securityEvents.map((event) => {
                const eventType = event.old_data?.event_type || 'UNKNOWN';
                const severity = getEventSeverity(eventType);
                
                return (
                  <div key={event.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(severity)}>
                          {severity.toUpperCase()}
                        </Badge>
                        <span className="font-medium">{eventType}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(event.created_at).toLocaleString('fr-FR')}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Table:</strong> {event.table_name}</p>
                      <p><strong>Utilisateur:</strong> {event.user_email || 'Anonyme'}</p>
                      {event.new_data && (
                        <p><strong>Détails:</strong> {JSON.stringify(event.new_data).slice(0, 100)}...</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
