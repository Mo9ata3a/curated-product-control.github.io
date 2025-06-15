
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import { Contribution } from "@/hooks/useContributions";

interface ContributionCardProps {
  contribution: Contribution;
  onStatusChange: (id: number, newStatus: string) => void;
  onDelete: (id: number) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
    }
};

export const ContributionCard = ({ contribution, onStatusChange, onDelete, isUpdating, isDeleting }: ContributionCardProps) => {
  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-start gap-4">
            {contribution.alt_image && (
                <img 
                    src={contribution.alt_image} 
                    alt="Alternative" 
                    className="w-16 h-16 object-cover rounded-md border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                />
            )}
            <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-bold leading-tight line-clamp-2">{contribution.alt_name || 'N/A'}</CardTitle>
                <p className="text-sm text-muted-foreground truncate">Pour: {contribution.product_name || 'N/A'}</p>
            </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2.5 text-sm">
          {contribution.alt_description && (
            <p className="text-muted-foreground line-clamp-3">{contribution.alt_description}</p>
          )}
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Note</span>
            <span className="font-semibold">{contribution.rating ? `${contribution.rating}/5` : 'N/A'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Statut</span>
            {getStatusBadge(contribution.status)}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Date</span>
            <span className="font-semibold">{new Date(contribution.created_at).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-2 bg-slate-50 border-t flex justify-end gap-2">
        {contribution.status === 'pending' && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(contribution.id, 'approved')}
              disabled={isUpdating}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-1.5" />
              Approuver
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusChange(contribution.id, 'rejected')}
              disabled={isUpdating}
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-1.5" />
              Rejeter
            </Button>
          </>
        )}
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(contribution.id)}
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          Supprimer
        </Button>
      </CardFooter>
    </Card>
  );
};
