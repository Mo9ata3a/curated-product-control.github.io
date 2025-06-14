
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AuditLog {
  id: string;
  table_name: string;
  operation: string;
  user_email: string | null;
  old_data: any;
  new_data: any;
  created_at: string;
}

export const AuditLogViewer = () => {
  const { data: auditLogs, isLoading, error } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        throw error;
      }
      
      return data as AuditLog[];
    },
  });

  const getOperationBadge = (operation: string) => {
    switch (operation) {
      case 'INSERT':
        return <Badge variant="default" className="bg-green-500">Création</Badge>;
      case 'UPDATE':
        return <Badge variant="default" className="bg-blue-500">Modification</Badge>;
      case 'DELETE':
        return <Badge variant="destructive">Suppression</Badge>;
      default:
        return <Badge variant="secondary">{operation}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Journal d'audit</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chargement des logs d'audit...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Journal d'audit</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Erreur lors du chargement des logs d'audit</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal d'audit ({auditLogs?.length || 0} entrées)</CardTitle>
        <p className="text-sm text-gray-500">
          Historique des modifications des données sensibles
        </p>
      </CardHeader>
      <CardContent>
        {!auditLogs || auditLogs.length === 0 ? (
          <p className="text-gray-500">Aucun log d'audit disponible</p>
        ) : (
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Opération</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Détails</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">
                      {new Date(log.created_at).toLocaleString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.table_name}</Badge>
                    </TableCell>
                    <TableCell>
                      {getOperationBadge(log.operation)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.user_email || 'Système'}
                    </TableCell>
                    <TableCell className="text-sm max-w-xs">
                      {log.operation === 'UPDATE' && log.old_data && log.new_data ? (
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">Changements détectés</div>
                          {Object.keys(log.new_data).map((key) => {
                            if (log.old_data[key] !== log.new_data[key]) {
                              return (
                                <div key={key} className="text-xs">
                                  <span className="font-medium">{key}:</span>{' '}
                                  <span className="text-red-500">{String(log.old_data[key] || 'null')}</span>
                                  {' → '}
                                  <span className="text-green-500">{String(log.new_data[key] || 'null')}</span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-500">
                          {log.operation === 'INSERT' ? 'Nouvel enregistrement' : 'Enregistrement supprimé'}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
