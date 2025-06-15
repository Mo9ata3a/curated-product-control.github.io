
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Trash2, User } from "lucide-react";
import type { AdminUser } from '../types/adminTypes';

interface AdminTableProps {
  admins: AdminUser[] | undefined;
  onRemoveAdmin: (userId: string) => void;
  isRemoving: boolean;
}

export const AdminTable = ({ admins, onRemoveAdmin, isRemoving }: AdminTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              ID Utilisateur
            </div>
          </TableHead>
          <TableHead>Date d'ajout</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {admins?.map((admin) => (
          <TableRow key={admin.user_id}>
            <TableCell>
              <div className="font-mono text-sm">
                {admin.user_id}
              </div>
            </TableCell>
            <TableCell>
              {new Date(admin.created_at).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemoveAdmin(admin.user_id)}
                disabled={isRemoving}
              >
                {isRemoving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {(!admins || admins.length === 0) && (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
              Aucun administrateur trouvé
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
