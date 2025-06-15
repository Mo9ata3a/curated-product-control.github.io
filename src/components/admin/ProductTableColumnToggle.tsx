
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListFilter } from "lucide-react";

export type ColumnConfig = {
  id: string;
  label: string;
};

export const productColumnsConfig: ColumnConfig[] = [
  { id: "name", label: "Nom" },
  { id: "marque", label: "Marque" },
  { id: "categorie", label: "Catégorie" },
  { id: "prix", label: "Prix" },
  { id: "status", label: "Statut" },
  { id: "ban", label: "Ban" },
  { id: "globalcategory", label: "Global Cat." },
  { id: "article", label: "Article" },
  { id: "namebic", label: "Nom BIC" },
  { id: "created_at", label: "Créé le" },
];

export type ColumnVisibilityState = {
  [key: string]: boolean;
};

interface ProductTableColumnToggleProps {
  columnVisibility: ColumnVisibilityState;
  onColumnVisibilityChange: React.Dispatch<React.SetStateAction<ColumnVisibilityState>>;
}

export function ProductTableColumnToggle({
  columnVisibility,
  onColumnVisibilityChange,
}: ProductTableColumnToggleProps) {
  const handleCheckedChange = (columnId: string) => (isChecked: boolean) => {
    onColumnVisibilityChange((prev) => ({
      ...prev,
      [columnId]: isChecked,
    }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <ListFilter className="mr-2 h-4 w-4" />
          Colonnes
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Afficher/Cacher</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {productColumnsConfig.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="capitalize"
            checked={columnVisibility[column.id] ?? true}
            onCheckedChange={handleCheckedChange(column.id)}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

