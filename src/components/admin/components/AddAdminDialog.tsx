
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, UserPlus } from "lucide-react";

interface AddAdminDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newAdminUserId: string;
  onUserIdChange: (userId: string) => void;
  onAddAdmin: () => void;
  isLoading: boolean;
}

export const AddAdminDialog = ({
  isOpen,
  onOpenChange,
  newAdminUserId,
  onUserIdChange,
  onAddAdmin,
  isLoading,
}: AddAdminDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter un administrateur
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouvel administrateur</DialogTitle>
          <DialogDescription>
            Saisissez l'ID utilisateur Supabase d'un compte existant pour lui donner les privilèges d'administrateur.
            L'utilisateur doit déjà avoir un compte dans le système.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userId">ID Utilisateur</Label>
            <Input
              id="userId"
              type="text"
              value={newAdminUserId}
              onChange={(e) => onUserIdChange(e.target.value)}
              placeholder="25e06519-14e2-48e5-9cf5-6c1e7b9fc979"
            />
            <p className="text-xs text-muted-foreground">
              L'ID utilisateur est un UUID au format : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button 
            onClick={onAddAdmin}
            disabled={isLoading}
          >
            {isLoading && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
