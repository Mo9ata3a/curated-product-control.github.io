
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnVisibilityState } from "./ProductTableColumnToggle";

interface ProductTableHeaderRowProps {
  columnVisibility: ColumnVisibilityState;
}

export const ProductTableHeaderRow = ({ columnVisibility }: ProductTableHeaderRowProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-16 px-6">Image</TableHead>
        {columnVisibility.name && <TableHead className="min-w-[200px]">Nom</TableHead>}
        {columnVisibility.marque && <TableHead className="min-w-[120px]">Marque</TableHead>}
        {columnVisibility.categorie && <TableHead className="min-w-[120px]">Catégorie</TableHead>}
        {columnVisibility.prix && <TableHead className="min-w-[100px]">Prix</TableHead>}
        {columnVisibility.status && <TableHead className="min-w-[80px]">Statut</TableHead>}
        {columnVisibility.ban && <TableHead className="min-w-[60px]">Ban</TableHead>}
        {columnVisibility.globalcategory && <TableHead className="min-w-[120px]">Global Cat.</TableHead>}
        {columnVisibility.article && <TableHead className="min-w-[100px]">Article</TableHead>}
        {columnVisibility.namebic && <TableHead className="min-w-[100px]">Nom BIC</TableHead>}
        {columnVisibility.created_at && <TableHead className="min-w-[100px]">Créé le</TableHead>}
        <TableHead className="text-right px-6 min-w-[120px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
