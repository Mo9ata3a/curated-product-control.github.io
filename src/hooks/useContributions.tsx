
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

export const useContributions = () => {
  return useQuery({
    queryKey: ['contributions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contributions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching contributions:', error);
        throw error;
      }
      
      return data as Contribution[];
    },
  });
};

export const useUpdateContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { data, error } = await supabase
        .from('contributions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating contribution:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
    },
  });
};

export const useDeleteContribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('contributions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting contribution:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contributions'] });
    },
  });
};
