
import { Product } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ProductEditForm } from "./ProductEditForm";

interface ProductTableDialogsProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  productToEdit: Product | null;
  productToDelete: Product | null;
  onEditSuccess: () => void;
  onEditCancel: () => void;
  onDeleteConfirm: () => void;
  isDeleting: boolean;
}

export const ProductTableDialogs = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  productToEdit,
  productToDelete,
  onEditSuccess,
  onEditCancel,
  onDeleteConfirm,
  isDeleting,
}: ProductTableDialogsProps) => {
  return (
    <>
      {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
            <DialogDescription>
              Modifiez les informations du produit "{productToEdit?.name}".
            </DialogDescription>
          </DialogHeader>
          {productToEdit && (
            <ProductEditForm
              product={productToEdit}
              onSuccess={onEditSuccess}
              onCancel={onEditCancel}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le produit "{productToDelete?.name}" sera supprimé définitivement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={onDeleteConfirm}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
