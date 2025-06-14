import { Product } from "@/types";
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
import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const mockProducts: Product[] = [
  { id: 1, name: "T-shirt Bio", prix: "25.00€", categorie: "Vêtements", marque: "EcoWear", hidden: false, photo_url: "https://via.placeholder.com/40" },
  { id: 2, name: "Jean Recyclé", prix: "79.90€", categorie: "Vêtements", marque: "ReJeans", hidden: false, photo_url: "https://via.placeholder.com/40" },
  { id: 3, name: "Gourde Inox", prix: "19.50€", categorie: "Accessoires", marque: "StayHydrated", hidden: true, photo_url: "https://via.placeholder.com/40" },
  { id: 4, name: "Savon Solide", prix: "8.00€", categorie: "Beauté", marque: "NatureClean", hidden: false, photo_url: "https://via.placeholder.com/40" },
];

const ProductTable = () => {
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
            {mockProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="px-6">
                  <img src={product.photo_url} alt={product.name} className="h-10 w-10 object-cover rounded-md" />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.marque}</TableCell>
                <TableCell>{product.categorie}</TableCell>
                <TableCell>{product.prix}</TableCell>
                <TableCell>
                  <Badge variant={product.hidden ? "outline" : "default"}>
                    {product.hidden ? "Caché" : "Visible"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2 px-6">
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductTable;
