
import { useState } from 'react';
import { ProductTableHeader } from '@/components/admin/ProductTableHeader';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import ProductTable from '@/components/admin/ProductTable';
import { validateSearchTerm } from '@/lib/validation';
import { productColumnsConfig, ColumnVisibilityState } from '@/components/admin/ProductTableColumnToggle';

interface ProductTabContentProps {
  onAddProduct: () => void;
  onActionSuccess: () => void;
}

export const ProductTabContent = ({ onAddProduct, onActionSuccess }: ProductTabContentProps) => {
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [productColumnVisibility, setProductColumnVisibility] = useState<ColumnVisibilityState>(() => {
    const initialState: Partial<ColumnVisibilityState> = {};
    for (const column of productColumnsConfig) {
        initialState[column.id] = true;
    }
    return initialState as ColumnVisibilityState;
  });

  return (
    <>
      <ProductTableHeader onAddProduct={onAddProduct} columnVisibility={productColumnVisibility} onColumnVisibilityChange={setProductColumnVisibility} />
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 my-4 sm:my-6">
        <div className="relative w-full max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Rechercher des produits..." value={productSearchTerm} onChange={(e) => setProductSearchTerm(validateSearchTerm(e.target.value))} className="pl-10" />
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <ProductTable searchTerm={productSearchTerm} onActionSuccess={onActionSuccess} columnVisibility={productColumnVisibility} />
      </div>
    </>
  );
};
