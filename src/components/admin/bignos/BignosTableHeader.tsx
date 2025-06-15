
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface BignosTableHeaderProps {
  onAddBigno: () => void;
}

export const BignosTableHeader = ({ onAddBigno }: BignosTableHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Liste des Bignos</h2>
      <Button onClick={onAddBigno} className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        Ajouter un Bigno
      </Button>
    </div>
  );
};
