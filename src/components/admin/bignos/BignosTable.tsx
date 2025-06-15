
import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { ProductTablePagination } from "../ProductTablePagination";
import { BignosTableHeaderRow } from "./BignosTableHeaderRow";
import { BignosTableRow } from "./BignosTableRow";
import { BignosTableDialogs } from "./BignosTableDialogs";
import { Bignos } from "./form/types";

const PAGE_SIZE = 10;

const BignosTable = ({
  searchTerm,
  onActionSuccess,
}: {
  searchTerm: string;
  onActionSuccess: () => void;
}) => {
  const [page, setPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [bignoToDelete, setBignoToDelete] = useState<Bignos | null>(null);
  const [bignoToEdit, setBignoToEdit] = useState<Bignos | null>(null);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const fetchBignos = async (page: number, search: string) => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from("bignos")
      .select("*", { count: "exact" });

    if (search) {
      const cleanedSearch = search.trim();
      query = query.or(`name.ilike.%${cleanedSearch}%,marque.ilike.%${cleanedSearch}%,categorie.ilike.%${cleanedSearch}%,article.ilike.%${cleanedSearch}%,globalcategory.ilike.%${cleanedSearch}%,namebic.ilike.%${cleanedSearch}%`);
    }

    const { data, error, count } = await query
      .order("id", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);
    return { bignos: data as Bignos[], count };
  };

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["bignos", page, searchTerm],
    queryFn: () => fetchBignos(page, searchTerm),
    placeholderData: (previousData) => previousData,
  });

  const { mutate: deleteBigno, isPending: isDeleting } = useMutation({
    mutationFn: async (bignoId: number) => {
      const { error } = await supabase.from("bignos").delete().eq("id", bignoId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Bigno supprimé avec succès !");
      onActionSuccess();
      setIsDeleteDialogOpen(false);
      setBignoToDelete(null);
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression : ${error.message}`);
      setIsDeleteDialogOpen(false);
      setBignoToDelete(null);
    },
  });

  const bignos = data?.bignos;
  const count = data?.count ?? 0;
  const pageCount = Math.ceil(count / PAGE_SIZE);

  const handleEdit = (bigno: Bignos) => {
    setBignoToEdit(bigno);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (bigno: Bignos) => {
    setBignoToDelete(bigno);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSuccess = () => {
    onActionSuccess();
    setIsEditDialogOpen(false);
    setBignoToEdit(null);
  };

  const handleEditCancel = () => {
    setIsEditDialogOpen(false);
    setBignoToEdit(null);
  };

  const handleDeleteConfirm = () => {
    if (bignoToDelete) {
      deleteBigno(bignoToDelete.id);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <BignosTableHeaderRow />
            <TableBody>
              {[...Array(PAGE_SIZE)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="px-6"><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
                  {[...Array(7)].map((_, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Une erreur est survenue lors de la récupération des bignos: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <BignosTableHeaderRow />
              <TableBody>
                {bignos?.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="h-24 text-center">Aucun bigno trouvé.</TableCell></TableRow>
                ) : bignos?.map((bigno) => (
                  <BignosTableRow key={bigno.id} bigno={bigno} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <ProductTablePagination page={page} pageCount={pageCount} count={count} onPageChange={setPage} />
      </Card>

      <BignosTableDialogs
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        bignoToEdit={bignoToEdit}
        bignoToDelete={bignoToDelete}
        onEditSuccess={handleEditSuccess}
        onEditCancel={handleEditCancel}
        onDeleteConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default BignosTable;
