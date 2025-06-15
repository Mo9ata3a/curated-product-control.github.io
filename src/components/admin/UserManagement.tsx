
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Shield } from "lucide-react";
import { useAdminManagement } from './hooks/useAdminManagement';
import { AdminWarningCard } from './components/AdminWarningCard';
import { AddAdminDialog } from './components/AddAdminDialog';
import { AdminTable } from './components/AdminTable';

const UserManagement = () => {
  const {
    admins,
    isLoading,
    newAdminUserId,
    setNewAdminUserId,
    isAddDialogOpen,
    setIsAddDialogOpen,
    addAdminMutation,
    removeAdminMutation,
    handleAddAdmin,
  } = useAdminManagement();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des utilisateurs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminWarningCard />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Gestion des Administrateurs
              </CardTitle>
              <CardDescription>
                Gérer les utilisateurs ayant des privilèges d'administrateur
              </CardDescription>
            </div>
            <AddAdminDialog
              isOpen={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              newAdminUserId={newAdminUserId}
              onUserIdChange={setNewAdminUserId}
              onAddAdmin={handleAddAdmin}
              isLoading={addAdminMutation.isPending}
            />
          </div>
        </CardHeader>
        <CardContent>
          <AdminTable
            admins={admins}
            onRemoveAdmin={removeAdminMutation.mutate}
            isRemoving={removeAdminMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
