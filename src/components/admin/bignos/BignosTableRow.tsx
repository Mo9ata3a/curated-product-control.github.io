
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bignos } from "./form/types";
import { BignosTableActions } from "./BignosTableActions";

interface BignosTableRowProps {
  bigno: Bignos;
  onEdit: (bigno: Bignos) => void;
  onDelete: (bigno: Bignos) => void;
}

export const BignosTableRow = ({ bigno, onEdit, onDelete }: BignosTableRowProps) => {
  return (
    <TableRow>
      <TableCell className="px-6">
        <img
          src={bigno.photo_url || '/placeholder.svg'}
          alt={bigno.name || 'Bigno image'}
          className="h-10 w-10 rounded-md object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </TableCell>
      <TableCell className="font-medium max-w-[200px] truncate">{bigno.name}</TableCell>
      <TableCell className="max-w-[150px] truncate">{bigno.marque}</TableCell>
      <TableCell className="max-w-[150px] truncate">{bigno.categorie}</TableCell>
      <TableCell>{bigno.prix}</TableCell>
      <TableCell className="max-w-[250px] truncate">{bigno.article}</TableCell>
      <TableCell>
        <Badge variant={bigno.ban ? "destructive" : "secondary"}>
          {bigno.ban ? "Oui" : "Non"}
        </Badge>
      </TableCell>
      <TableCell className="text-right space-x-2 px-6">
        <BignosTableActions bigno={bigno} onEdit={onEdit} onDelete={onDelete} />
      </TableCell>
    </TableRow>
  );
};
