
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import type { AdminUser } from '../types/adminTypes';

export const useAdminManagement = () => {
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

  return {
    admins,
    isLoading,
    newAdminUserId,
    setNewAdminUserId,
    isAddDialogOpen,
    setIsAddDialogOpen,
    addAdminMutation,
    removeAdminMutation,
    handleAddAdmin,
  };
};
