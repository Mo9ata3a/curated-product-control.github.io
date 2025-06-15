
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProductTableHeaderProps {
  onAddProduct: () => void;
}

export const ProductTableHeader = ({ onAddProduct }: ProductTableHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestion des produits</h2>
        <p className="text-gray-600">Gérez votre catalogue de produits</p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          onClick={onAddProduct}
          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouveau produit
        </Button>
      </div>
    </div>
  );
};
