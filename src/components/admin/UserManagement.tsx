
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
import { Loader2, UserPlus, Trash2, Shield, User } from "lucide-react";

interface AdminUser {
  user_id: string;
  created_at: string;
  email?: string;
}

const UserManagement = () => {
  const [newAdminEmail, setNewAdminEmail] = useState('');
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

      // Pour chaque admin, essayer de récupérer les infos utilisateur depuis auth.users
      const adminsWithEmails = await Promise.all(
        data.map(async (admin) => {
          try {
            // Note: En production, vous devriez créer une fonction edge ou une vue pour récupérer les emails
            // car auth.users n'est pas directement accessible via l'API
            return {
              ...admin,
              email: `Utilisateur ${admin.user_id.substring(0, 8)}...`
            };
          } catch (error) {
            return {
              ...admin,
              email: 'Email non disponible'
            };
          }
        })
      );

      return adminsWithEmails;
    },
  });

  // Ajouter un nouvel administrateur
  const addAdminMutation = useMutation({
    mutationFn: async (email: string) => {
      console.log('Adding new admin with email:', email);
      
      // D'abord, inviter l'utilisateur si il n'existe pas
      const { data: signUpData, error: signUpError } = await supabase.auth.admin.inviteUserByEmail(email);
      
      if (signUpError && signUpError.message !== 'User already registered') {
        throw signUpError;
      }

      // Récupérer l'ID utilisateur
      let userId = signUpData?.user?.id;
      
      if (!userId) {
        // Si l'utilisateur existe déjà, essayer de le trouver
        const { data: existingUsers, error: getUserError } = await supabase.auth.admin.listUsers();
        if (getUserError) throw getUserError;
        
        const existingUser = existingUsers.users.find(u => u.email === email);
        if (!existingUser) throw new Error('Utilisateur non trouvé');
        userId = existingUser.id;
      }

      // Ajouter à la table admins
      const { error: adminError } = await supabase
        .from('admins')
        .insert({ user_id: userId });

      if (adminError) throw adminError;

      return { userId, email };
    },
    onSuccess: () => {
      toast({
        title: "Administrateur ajouté",
        description: "Le nouvel administrateur a été ajouté avec succès.",
      });
      setNewAdminEmail('');
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
    if (!newAdminEmail.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir une adresse email valide.",
        variant: "destructive",
      });
      return;
    }
    addAdminMutation.mutate(newAdminEmail.trim());
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
                    Saisissez l'adresse email de l'utilisateur à promouvoir administrateur. 
                    Si l'utilisateur n'existe pas, une invitation lui sera envoyée.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="admin@exemple.com"
                    />
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
                    Utilisateur
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
                    <div>
                      <div className="font-medium">{admin.email}</div>
                      <div className="text-sm text-muted-foreground">
                        ID: {admin.user_id.substring(0, 8)}...
                      </div>
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
