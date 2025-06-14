
import { Product } from "@/types";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff } from "lucide-react";
import { ProductTableActions } from "./ProductTableActions";

interface ProductTableRowProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductTableRow = ({ product, onEdit, onDelete }: ProductTableRowProps) => {
  return (
    <TableRow key={product.id}>
      <TableCell className="px-6">
        <img
          src={product.photo_url || "https://via.placeholder.com/40"}
          alt={product.name || ""}
          className="h-10 w-10 object-cover rounded-md"
        />
      </TableCell>
      <TableCell className="font-medium max-w-[200px] truncate">
        {product.name}
      </TableCell>
      <TableCell className="max-w-[120px] truncate">
        {product.marque}
      </TableCell>
      <TableCell className="max-w-[120px] truncate">
        {product.categorie}
      </TableCell>
      <TableCell>{product.prix ? `${product.prix} €` : "-"}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {product.hidden ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-green-500" />
          )}
          <Badge variant={product.hidden ? "outline" : "default"}>
            {product.hidden ? "Caché" : "Visible"}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={product.ban ? "destructive" : "secondary"}>
          {product.ban ? "Banni" : "OK"}
        </Badge>
      </TableCell>
      <TableCell className="max-w-[120px] truncate">
        {product.globalcategory || "-"}
      </TableCell>
      <TableCell className="max-w-[100px] truncate" title={product.article || ""}>
        {product.article || "-"}
      </TableCell>
      <TableCell className="max-w-[100px] truncate">
        {product.namebic || "-"}
      </TableCell>
      <TableCell className="text-sm text-gray-500">
        {product.created_at ? new Date(product.created_at).toLocaleDateString('fr-FR') : "-"}
      </TableCell>
      <TableCell className="text-right space-x-2 px-6">
        <ProductTableActions
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};
