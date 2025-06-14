
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface ProductTableActionsProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductTableActions = ({ product, onEdit, onDelete }: ProductTableActionsProps) => {
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onEdit(product)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => onDelete(product)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );
};
