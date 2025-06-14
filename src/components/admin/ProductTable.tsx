import { useState, useEffect } from "react";
import { Product } from "@/types";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const PAGE_SIZE = 10;

const ProductTable = ({
  searchTerm,
  onActionSuccess,
}: {
  searchTerm: string;
  onActionSuccess: () => void;
}) => {
  const [page, setPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const fetchProducts = async (page: number, search: string) => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("products")
      .select("id, name, prix, categorie, marque, hidden, photo_url", {
        count: "exact",
      });

    if (search) {
      const cleanedSearch = search.trim();
      query = query.or(`name.ilike.%${cleanedSearch}%,marque.ilike.%${cleanedSearch}%,categorie.ilike.%${cleanedSearch}%`);
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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 px-6">Image</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Marque</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(PAGE_SIZE)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="px-6">
                    <Skeleton className="h-10 w-10 rounded-md" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 px-6">Image</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Marque</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.length === 0 && !isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Aucun produit trouvé.
                  </TableCell>
                </TableRow>
              ) : products?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="px-6">
                    <img
                      src={product.photo_url || "https://via.placeholder.com/40"}
                      alt={product.name || ""}
                      className="h-10 w-10 object-cover rounded-md"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.marque}</TableCell>
                  <TableCell>{product.categorie}</TableCell>
                  <TableCell>{product.prix ? `${product.prix} €` : "-"}</TableCell>
                  <TableCell>
                    <Badge variant={product.hidden ? "outline" : "default"}>
                      {product.hidden ? "Caché" : "Visible"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2 px-6">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        toast.info(
                          "La fonction de modification n'est pas encore disponible."
                        )
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setProductToDelete(product);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <div className="flex items-center justify-between space-x-2 py-4 px-6 border-t">
          <div className="text-sm text-muted-foreground">
            Page {page} sur {pageCount}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page >= pageCount}
            >
              Suivant
            </Button>
          </div>
        </div>
      </Card>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit "{productToDelete?.name}" sera supprimé définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={() => {
                if (productToDelete) {
                  deleteProduct(productToDelete.id);
                }
              }}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProductTable;
