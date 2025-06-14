
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useContributions, useUpdateContribution, useDeleteContribution } from "@/hooks/useContributions";
import { CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const ContributionsTable = () => {
  const { data: contributions, isLoading, error } = useContributions();
  const updateContribution = useUpdateContribution();
  const deleteContribution = useDeleteContribution();

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

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateContribution.mutateAsync({ id, status: newStatus });
      toast.success(`Contribution ${newStatus === 'approved' ? 'approuvée' : 'rejetée'}`);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette contribution ?')) {
      try {
        await deleteContribution.mutateAsync(id);
        toast.success("Contribution supprimée");
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contributions des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contributions des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Erreur lors du chargement des contributions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contributions des utilisateurs ({contributions?.length || 0})</CardTitle>
      </CardHeader>
      <CardContent>
        {!contributions || contributions.length === 0 ? (
          <p className="text-gray-500">Aucune contribution pour le moment</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit original</TableHead>
                <TableHead>Alternative proposée</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contributions.map((contribution) => (
                <TableRow key={contribution.id}>
                  <TableCell className="font-medium">
                    {contribution.product_name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{contribution.alt_name || 'N/A'}</div>
                      {contribution.alt_image && (
                        <img 
                          src={contribution.alt_image} 
                          alt="Alternative" 
                          className="w-12 h-12 object-cover rounded mt-1"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="truncate" title={contribution.alt_description || ''}>
                      {contribution.alt_description || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {contribution.rating ? `${contribution.rating}/5` : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(contribution.status)}
                  </TableCell>
                  <TableCell>
                    {new Date(contribution.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {contribution.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(contribution.id, 'approved')}
                            disabled={updateContribution.isPending}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(contribution.id, 'rejected')}
                            disabled={updateContribution.isPending}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(contribution.id)}
                        disabled={deleteContribution.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
