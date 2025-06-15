
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Loader2, UserPlus, Trash2, Shield, User, AlertTriangle } from "lucide-react";

interface AdminUser {
  user_id: string;
  created_at: string;
}

const UserManagement = () => {
  const [newAdminUserId, setNewAdminUserId] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Récupérer la liste des administrateurs
  const { data: admins, isLoading } = useQuery({
    queryKey: ['admins'],
    queryFn: async () => {
      console.log('Fetching admins list...');
      const { data, error } = await supabase
        .from('admins')
        .select('user_id, created_at');
      
      if (error) {
        console.error('Error fetching admins:', error);
        throw error;
      }

      return data || [];
    },
  });

  // Ajouter un nouvel administrateur par ID utilisateur
  const addAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log('Adding new admin with user ID:', userId);
      
      // Ajouter directement à la table admins
      const { error } = await supabase
        .from('admins')
        .insert({ user_id: userId });

      if (error) throw error;

      return { userId };
    },
    onSuccess: () => {
      toast({
        title: "Administrateur ajouté",
        description: "Le nouvel administrateur a été ajouté avec succès.",
      });
      setNewAdminUserId('');
      setIsAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
    onError: (error: any) => {
      console.error('Error adding admin:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'ajouter l'administrateur.",
        variant: "destructive",
      });
    },
  });

  // Supprimer un administrateur
  const removeAdminMutation = useMutation({
    mutationFn: async (userId: string) => {
      console.log('Removing admin:', userId);
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Administrateur supprimé",
        description: "L'administrateur a été supprimé avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ['admins'] });
    },
    onError: (error: any) => {
      console.error('Error removing admin:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'administrateur.",
        variant: "destructive",
      });
    },
  });

  const handleAddAdmin = () => {
    if (!newAdminUserId.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un ID utilisateur valide.",
        variant: "destructive",
      });
      return;
    }
    addAdminMutation.mutate(newAdminUserId.trim());
  };

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
      {/* Avertissement sur les limitations */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <AlertTriangle className="h-5 w-5" />
            Information importante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-amber-700 text-sm">
            Pour des raisons de sécurité, l'invitation automatique d'utilisateurs n'est pas disponible avec la configuration actuelle. 
            Pour ajouter un administrateur, vous devez saisir l'ID utilisateur d'un compte Supabase existant.
          </p>
        </CardContent>
      </Card>

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
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                      onChange={(e) => setNewAdminUserId(e.target.value)}
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
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleAddAdmin}
                    disabled={addAdminMutation.isPending}
                  >
                    {addAdminMutation.isPending && (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    )}
                    Ajouter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
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
                      onClick={() => removeAdminMutation.mutate(admin.user_id)}
                      disabled={removeAdminMutation.isPending}
                    >
                      {removeAdminMutation.isPending ? (
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
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
