
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, User } from "lucide-react";
import type { AdminUser } from '../types/adminTypes';

interface AdminCardProps {
  admin: AdminUser;
  onRemoveAdmin: (userId: string) => void;
  isRemoving: boolean;
}

export const AdminCard = ({ admin, onRemoveAdmin, isRemoving }: AdminCardProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-semibold truncate">Administrateur</p>
                </div>
                <p className="text-xs text-muted-foreground font-mono truncate" title={admin.user_id}>{admin.user_id}</p>
                <p className="text-xs text-muted-foreground mt-2">
                    Ajouté le {new Date(admin.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    })}
                </p>
            </div>
            <Button
                variant="destructive"
                size="icon"
                onClick={() => onRemoveAdmin(admin.user_id)}
                disabled={isRemoving}
                className="ml-4 flex-shrink-0"
            >
                {isRemoving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                <Trash2 className="h-4 w-4" />
                )}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};
