
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bignos } from "./form/types";
import { SecureBignosEditForm } from "./SecureBignosEditForm";

interface BignosTableDialogsProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  bignoToEdit: Bignos | null;
  bignoToDelete: Bignos | null;
  onEditSuccess: () => void;
  onEditCancel: () => void;
  onDeleteConfirm: () => void;
  isDeleting: boolean;
}

export const BignosTableDialogs = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  bignoToEdit,
  bignoToDelete,
  onEditSuccess,
  onEditCancel,
  onDeleteConfirm,
  isDeleting,
}: BignosTableDialogsProps) => {
  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le bigno</DialogTitle>
          </DialogHeader>
          {bignoToEdit && (
            <SecureBignosEditForm
              bigno={bignoToEdit}
              onSuccess={onEditSuccess}
              onCancel={onEditCancel}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le bigno "{bignoToDelete?.name}" ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={onDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
