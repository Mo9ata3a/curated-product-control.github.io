
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PAGE_SIZE = 10;

const fetchProducts = async (page: number, search: string) => {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" });

  if (search) {
    query = query.or(`name.ilike.%${search}%,marque.ilike.%${search}%,categorie.ilike.%${search}%,article.ilike.%${search}%,eng.ilike.%${search}%,globalcategory.ilike.%${search}%,namebic.ilike.%${search}%`);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return { products: data as Product[], count };
};

export const useProductTable = (searchTerm: string, onActionSuccess: () => void) => {
  const [page, setPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", page, searchTerm],
    queryFn: () => fetchProducts(page, searchTerm),
    placeholderData: (previousData) => previousData,
  });

  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: async (productId: number) => {
      const { error } = await supabase.from("products").delete().eq("id", productId);
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Produit supprimé avec succès !");
      onActionSuccess();
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression : ${error.message}`);
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    },
  });

  const products = data?.products;
  const count = data?.count ?? 0;
  const pageCount = Math.ceil(count / PAGE_SIZE);

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSuccess = () => {
    onActionSuccess();
    setIsEditDialogOpen(false);
    setProductToEdit(null);
  };

  const handleEditCancel = () => {
    setIsEditDialogOpen(false);
    setProductToEdit(null);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
    }
  };

  return {
    page,
    setPage,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    productToDelete,
    productToEdit,
    products,
    count,
    pageCount,
    isLoading,
    isError,
    error,
    isDeleting,
    handleEdit,
    handleDelete,
    handleEditSuccess,
    handleEditCancel,
    handleDeleteConfirm,
  };
};
