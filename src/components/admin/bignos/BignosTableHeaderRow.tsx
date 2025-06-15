
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const BignosTableHeaderRow = () => (
  <TableHeader>
    <TableRow>
      <TableHead className="px-6">Image</TableHead>
      <TableHead>Nom</TableHead>
      <TableHead>Marque</TableHead>
      <TableHead>Catégorie</TableHead>
      <TableHead>Prix</TableHead>
      <TableHead>Article</TableHead>
      <TableHead>Banni</TableHead>
      <TableHead className="text-right px-6">Actions</TableHead>
    </TableRow>
  </TableHeader>
);
