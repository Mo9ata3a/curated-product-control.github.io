import { useState, useEffect } from "react";
import { Product } from "@/types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { ProductTableHeaderRow } from "./ProductTableHeaderRow";
import { ProductTableRow } from "./ProductTableRow";
import { ProductTablePagination } from "./ProductTablePagination";
import { ProductTableDialogs } from "./ProductTableDialogs";
import { ColumnVisibilityState } from "./ProductTableColumnToggle";

const PAGE_SIZE = 10;

const ProductTable = ({
  searchTerm,
  onActionSuccess,
  columnVisibility,
}: {
  searchTerm: string;
  onActionSuccess: () => void;
  columnVisibility: ColumnVisibilityState;
}) => {
  const [page, setPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

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

  if (isLoading) {
    const visibleColumnCount = Object.values(columnVisibility).filter(v => v).length;
    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <ProductTableHeaderRow columnVisibility={columnVisibility} />
            <TableBody>
              {[...Array(PAGE_SIZE)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="px-6">
                    <Skeleton className="h-10 w-10 rounded-md" />
                  </TableCell>
                  {[...Array(visibleColumnCount)].map((_, j) => (
                    <TableCell key={j} className="p-4">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                  ))}
                  <TableCell className="text-right space-x-2 px-6">
                    <Skeleton className="h-8 w-8 inline-block" />
                    <Skeleton className="h-8 w-8 inline-block" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Une erreur est survenue lors de la récupération des produits: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <ProductTableHeaderRow columnVisibility={columnVisibility} />
              <TableBody>
                {products?.length === 0 && !isLoading ? (
                  <TableRow>
                    <TableCell colSpan={Object.values(columnVisibility).filter(v => v).length + 2} className="h-24 text-center">
                      Aucun produit trouvé.
                    </TableCell>
                  </TableRow>
                ) : products?.map((product) => (
                  <ProductTableRow
                    key={product.id}
                    product={product}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    columnVisibility={columnVisibility}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <ProductTablePagination
          page={page}
          pageCount={pageCount}
          count={count}
          onPageChange={setPage}
        />
      </Card>

      <ProductTableDialogs
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        productToEdit={productToEdit}
        productToDelete={productToDelete}
        onEditSuccess={handleEditSuccess}
        onEditCancel={handleEditCancel}
        onDeleteConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default ProductTable;
