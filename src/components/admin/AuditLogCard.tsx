
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AuditLog {
  id: string;
  table_name: string;
  operation: string;
  user_email: string | null;
  old_data: any;
  new_data: any;
  created_at: string;
}

interface AuditLogCardProps {
  log: AuditLog;
}

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

export const AuditLogCard = ({ log }: AuditLogCardProps) => {
  return (
    <Card>
      <CardHeader className="p-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{log.table_name}</Badge>
            {getOperationBadge(log.operation)}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {new Date(log.created_at).toLocaleString('fr-FR')} par {log.user_email || 'Système'}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="text-sm">
            {log.operation === 'UPDATE' && log.old_data && log.new_data ? (
                <div className="space-y-1 bg-slate-50 p-2 rounded-md">
                    <div className="text-xs text-gray-500">Changements détectés</div>
                    {Object.keys(log.new_data).filter(key => log.old_data[key] !== log.new_data[key]).length > 0 ?
                      Object.keys(log.new_data).map((key) => {
                        if (log.old_data[key] !== log.new_data[key]) {
                          return (
                            <div key={key} className="text-xs break-all">
                                <span className="font-medium">{key}:</span>{' '}
                                <span className="text-red-500 line-through">{String(log.old_data[key] || 'null')}</span>
                                {' → '}
                                <span className="text-green-500">{String(log.new_data[key] || 'null')}</span>
                            </div>
                          );
                        }
                        return null;
                      }) : <div className="text-xs text-gray-500">Aucun changement de valeur détecté.</div>
                    }
                </div>
            ) : (
                <div className="text-xs text-gray-500">
                    {log.operation === 'INSERT' ? 'Nouvel enregistrement' : 'Enregistrement supprimé'}
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
};
