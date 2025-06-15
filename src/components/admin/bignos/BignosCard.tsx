
import { Bignos } from "./form/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BignosCardProps {
  bigno: Bignos;
  onEdit: (bigno: Bignos) => void;
  onDelete: (bigno: Bignos) => void;
}

export const BignosCard = ({ bigno, onEdit, onDelete }: BignosCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 p-4">
        <img
          src={bigno.photo_url || '/placeholder.svg'}
          alt={bigno.name || ""}
          className="h-16 w-16 object-cover rounded-md border"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        <div className="flex-1">
          <CardTitle className="text-base font-bold leading-tight line-clamp-2">{bigno.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{bigno.marque}</p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2.5">
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Prix</span>
                <span className="font-semibold">{bigno.prix || "-"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Catégorie</span>
                <span className="truncate max-w-[150px]">{bigno.categorie}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Article</span>
                <span className="truncate max-w-[150px]">{bigno.article}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Banni</span>
                <Badge variant={bigno.ban ? "destructive" : "secondary"} className="px-2 py-0.5 text-xs">
                    {bigno.ban ? "Oui" : "Non"}
                </Badge>
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 bg-slate-50 border-t flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(bigno)}
        >
          <Edit className="h-3.5 w-3.5 mr-1.5" />
          Modifier
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(bigno)}
        >
          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};
