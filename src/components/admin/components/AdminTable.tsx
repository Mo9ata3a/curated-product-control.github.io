
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Trash2, User } from "lucide-react";
import type { AdminUser } from '../types/adminTypes';
import { AdminCard } from './AdminCard';

interface AdminTableProps {
  admins: AdminUser[] | undefined;
  onRemoveAdmin: (userId: string) => void;
  isRemoving: boolean;
}

export const AdminTable = ({ admins, onRemoveAdmin, isRemoving }: AdminTableProps) => {
  if (!admins || admins.length === 0) {
    return (
        <div className="text-center py-8 text-muted-foreground">
            Aucun administrateur trouvé
        </div>
    );
  }

  return (
    <>
        {/* Desktop Table View */}
        <div className="hidden md:block">
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
                </TableBody>
            </Table>
        </div>
        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
            {admins.map((admin) => (
            <AdminCard
                key={admin.user_id}
                admin={admin}
                onRemoveAdmin={onRemoveAdmin}
                isRemoving={isRemoving}
            />
            ))}
        </div>
    </>
  );
};
