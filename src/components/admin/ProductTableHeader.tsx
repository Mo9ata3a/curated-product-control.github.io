
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const ProductTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-16 px-6">Image</TableHead>
        <TableHead className="min-w-[200px]">Nom</TableHead>
        <TableHead className="min-w-[120px]">Marque</TableHead>
        <TableHead className="min-w-[120px]">Catégorie</TableHead>
        <TableHead className="min-w-[100px]">Prix</TableHead>
        <TableHead className="min-w-[80px]">Statut</TableHead>
        <TableHead className="min-w-[60px]">Ban</TableHead>
        <TableHead className="min-w-[120px]">Global Cat.</TableHead>
        <TableHead className="min-w-[100px]">Article</TableHead>
        <TableHead className="min-w-[100px]">Nom BIC</TableHead>
        <TableHead className="min-w-[100px]">Créé le</TableHead>
        <TableHead className="text-right px-6 min-w-[120px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
