
import { Product } from "@/types";
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
import { ProductTableHeaderRow } from "./ProductTableHeaderRow";
import { ProductTableRow } from "./ProductTableRow";
import { ProductTablePagination } from "./ProductTablePagination";
import { ProductTableDialogs } from "./ProductTableDialogs";
import { ColumnVisibilityState } from "./ProductTableColumnToggle";
import { useProductTable } from "@/hooks/useProductTable";

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
