import { Product } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export const ProductCard = ({ product, onEdit, onDelete }: ProductCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <img
          src={product.photo_url || "https://via.placeholder.com/64"}
          alt={product.name || ""}
          className="h-16 w-16 object-cover rounded-md border"
        />
        <div className="flex-1">
          <CardTitle className="text-base font-bold leading-tight line-clamp-2">{product.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{product.marque}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Prix</span>
                <span className="font-semibold">{product.prix ? `${product.prix} €` : "-"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Catégorie</span>
                <span className="truncate max-w-[150px]">{product.categorie}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Statut</span>
                <Badge variant={product.hidden ? "outline" : "default"} className="px-2 py-0.5 text-xs">
                    {product.hidden ? "Caché" : "Visible"}
                </Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Ban</span>
                <Badge variant={!product.ban ? "success" : "destructive"} className="px-2 py-0.5 text-xs">
                    {!product.ban ? "Non banni" : "Banni"}
                </Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Créé le</span>
                <span className="text-muted-foreground">
                    {product.created_at ? new Date(product.created_at).toLocaleDateString('fr-FR') : "-"}
                </span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 bg-slate-50 border-t flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(product)}
        >
          <Edit className="h-3.5 w-3.5 mr-1.5" />
          Modifier
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(product)}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};
