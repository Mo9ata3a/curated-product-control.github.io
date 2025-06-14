
import { Button } from "@/components/ui/button";

interface ProductTablePaginationProps {
  page: number;
  pageCount: number;
  count: number;
  onPageChange: (page: number) => void;
}

export const ProductTablePagination = ({ 
  page, 
  pageCount, 
  count, 
  onPageChange 
}: ProductTablePaginationProps) => {
  return (
    <div className="flex items-center justify-between space-x-2 py-4 px-6 border-t">
      <div className="text-sm text-muted-foreground">
        Page {page} sur {pageCount} ({count} produits au total)
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};
