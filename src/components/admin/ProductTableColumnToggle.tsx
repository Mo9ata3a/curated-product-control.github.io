
import * as React from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Columns2 } from "lucide-react";

export type ColumnVisibilityState = {
  name: boolean;
  marque: boolean;
  categorie: boolean;
  prix: boolean;
  status: boolean;
  ban: boolean;
  globalcategory: boolean;
  article: boolean;
  namebic: boolean;
  created_at: boolean;
  [key: string]: boolean;
};

interface ColumnConfig {
  id: keyof ColumnVisibilityState;
  label: string;
}

export const productColumnsConfig: ColumnConfig[] = [
    { id: 'name', label: 'Nom' },
    { id: 'marque', label: 'Marque' },
    { id: 'categorie', label: 'Catégorie' },
    { id: 'prix', label: 'Prix' },
    { id: 'status', label: 'Statut' },
    { id: 'ban', label: 'Ban' },
    { id: 'globalcategory', label: 'Global Cat.' },
    { id: 'article', label: 'Article' },
    { id: 'namebic', label: 'Nom BIC' },
    { id: 'created_at', label: 'Créé le' },
];

interface ProductTableColumnToggleProps {
  columnVisibility: ColumnVisibilityState;
  onColumnVisibilityChange: React.Dispatch<React.SetStateAction<ColumnVisibilityState>>;
}

export const ProductTableColumnToggle = ({ columnVisibility, onColumnVisibilityChange }: ProductTableColumnToggleProps) => {
  const toggleColumn = (columnId: keyof ColumnVisibilityState) => {
    onColumnVisibilityChange(prev => ({ ...prev, [columnId]: !prev[columnId] }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <Columns2 className="mr-2 h-4 w-4" />
          Colonnes
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Afficher/Cacher</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {productColumnsConfig.map(column => (
          <DropdownMenuCheckboxItem
            key={column.id}
            className="capitalize"
            checked={columnVisibility[column.id]}
            onCheckedChange={() => toggleColumn(column.id)}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
