
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

      // Extract unique categories with more robust filtering
      const uniqueCategories = [...new Set(data.map(item => item.categorie))]
        .filter(category => category && category.trim() !== "") // Filter out null, undefined, and empty/whitespace strings
        .sort();

      return uniqueCategories;
    },
  });
};
