
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProductFormData {
  name: string;
  marque: string;
  categorie: string;
  prix: string;
  photo_url: string;
  eng: string;
  article: string;
  globalcategory: string;
  namebic: string;
  categorieold: string;
}

interface BasicInfoFieldsProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export const BasicInfoFields = ({ register, errors }: BasicInfoFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Nom du produit */}
      <div className="space-y-2">
        <Label htmlFor="name">Nom du produit *</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Nom du produit"
          maxLength={200}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Marque */}
      <div className="space-y-2">
        <Label htmlFor="marque">Marque *</Label>
        <Input
          id="marque"
          {...register("marque")}
          placeholder="Marque"
          maxLength={100}
        />
        {errors.marque && (
          <p className="text-sm text-red-500">{errors.marque.message}</p>
        )}
      </div>

      {/* Catégorie */}
      <div className="space-y-2">
        <Label htmlFor="categorie">Catégorie *</Label>
        <Input
          id="categorie"
          {...register("categorie")}
          placeholder="Catégorie"
          maxLength={100}
        />
        {errors.categorie && (
          <p className="text-sm text-red-500">{errors.categorie.message}</p>
        )}
      </div>

      {/* Prix */}
      <div className="space-y-2">
        <Label htmlFor="prix">Prix</Label>
        <Input
          id="prix"
          {...register("prix")}
          placeholder="99.99"
          type="text"
          pattern="[0-9]+(\.[0-9]{1,2})?"
        />
        {errors.prix && (
          <p className="text-sm text-red-500">{errors.prix.message}</p>
        )}
      </div>
    </div>
  );
};
