
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("categorie")
        .not("categorie", "is", null)
        .neq("categorie", "");

      if (error) {
        throw error;
      }

      // Extraire les catégories uniques et les trier
      const uniqueCategories = [...new Set(data.map(item => item.categorie))]
        .filter(Boolean)
        .sort();

      return uniqueCategories;
    },
  });
};
