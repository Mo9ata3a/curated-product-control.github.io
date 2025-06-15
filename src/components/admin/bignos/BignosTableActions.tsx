
import { Bignos } from "./form/types";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface BignosTableActionsProps {
  bigno: Bignos;
  onEdit: (bigno: Bignos) => void;
  onDelete: (bigno: Bignos) => void;
}

export const BignosTableActions = ({ bigno, onEdit, onDelete }: BignosTableActionsProps) => {
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onEdit(bigno)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="destructive"
        size="icon"
        onClick={() => onDelete(bigno)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </>
  );
};
