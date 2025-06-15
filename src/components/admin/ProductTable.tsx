
import { Product } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { ProductTableHeaderRow } from "./ProductTableHeaderRow";
import { ProductTableRow } from "./ProductTableRow";
import { ProductTablePagination } from "./ProductTablePagination";
import { ProductTableDialogs } from "./ProductTableDialogs";
import { ColumnVisibilityState } from "./ProductTableColumnToggle";
import { useProductTable } from "@/hooks/useProductTable";
import { ProductCard } from "./ProductCard";

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
  const {
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
  } = useProductTable(searchTerm, onActionSuccess);

  if (isLoading) {
    const visibleColumnCount = Object.values(columnVisibility).filter(v => v).length;
    return (
      <>
        {/* Desktop Skeleton */}
        <div className="hidden md:block">
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
        </div>
        {/* Mobile Skeleton */}
        <div className="md:hidden space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-start gap-4 p-4">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter className="p-2 bg-slate-50 border-t flex justify-end gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </>
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
      {/* Desktop Table View */}
      <div className="hidden md:block">
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
      </div>
      
      {/* Mobile Card View */}
      <div className="md:hidden">
        {products?.length === 0 && !isLoading ? (
          <div className="text-center py-16 text-muted-foreground">
            Aucun produit trouvé.
          </div>
        ) : (
          <div className="space-y-4">
            {products?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
        {pageCount > 1 &&
          <div className="mt-6">
            <ProductTablePagination
              page={page}
              pageCount={pageCount}
              count={count}
              onPageChange={setPage}
            />
          </div>
        }
      </div>


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
