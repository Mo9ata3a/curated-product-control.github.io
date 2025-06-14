
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { contributionSchema, sanitizeError } from '@/lib/validation';
import { toast } from 'sonner';

export type Contribution = {
  id: number;
  user_id: string | null;
  product_name: string | null;
  alt_name: string | null;
  alt_description: string | null;
  alt_image: string | null;
  rating: number | null;
  status: string;
  created_at: string;
  updated_at: string | null;
};

// Hook sécurisé pour les contributions
export const useSecureContributions = () => {
  return useQuery({
    queryKey: ['secure-contributions'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('contributions')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching contributions:', error);
          throw new Error(sanitizeError(error));
        }
        
        return data as Contribution[];
      } catch (error) {
        console.error('Secure contributions fetch error:', error);
        throw error;
      }
    },
  });
};

export const useSecureUpdateContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      try {
        // Validation du statut
        const validStatuses = ['pending', 'approved', 'rejected'];
        if (!validStatuses.includes(status)) {
          throw new Error('Statut invalide');
        }

        const { data, error } = await supabase
          .from('contributions')
          .update({ 
            status, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', id)
          .select()
          .single();

        if (error) {
          console.error('Error updating contribution:', error);
          throw new Error(sanitizeError(error));
        }

        return data;
      } catch (error) {
        console.error('Secure update contribution error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secure-contributions'] });
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
    },
    onError: (error) => {
      toast.error(sanitizeError(error));
    },
  });
};

export const useSecureDeleteContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        // Validation de l'ID
        if (!id || typeof id !== 'number' || id <= 0) {
          throw new Error('ID de contribution invalide');
        }

        const { error } = await supabase
          .from('contributions')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error deleting contribution:', error);
          throw new Error(sanitizeError(error));
        }
      } catch (error) {
        console.error('Secure delete contribution error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secure-contributions'] });
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      toast.success('Contribution supprimée avec succès');
    },
    onError: (error) => {
      toast.error(sanitizeError(error));
    },
  });
};

// Hook pour créer une contribution de manière sécurisée
export const useSecureCreateContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contributionData: any) => {
      try {
        // Validation stricte des données
        const validatedData = contributionSchema.parse(contributionData);

        const { data, error } = await supabase
          .from('contributions')
          .insert([{
            ...validatedData,
            status: 'pending',
            created_at: new Date().toISOString(),
          }])
          .select()
          .single();

        if (error) {
          console.error('Error creating contribution:', error);
          throw new Error(sanitizeError(error));
        }

        return data;
      } catch (error) {
        console.error('Secure create contribution error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secure-contributions'] });
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
      toast.success('Contribution créée avec succès');
    },
    onError: (error) => {
      toast.error(sanitizeError(error));
    },
  });
};
