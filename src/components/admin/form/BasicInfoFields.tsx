
import { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ProductFormData } from "./types";
import { useCategories } from "@/hooks/useCategories";

interface BasicInfoFieldsProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  control?: Control<ProductFormData>;
}

export const BasicInfoFields = ({ register, errors, control }: BasicInfoFieldsProps) => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();

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
      {control ? (
        <FormField
          control={control}
          name="categorie"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={categoriesLoading}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={categoriesLoading ? "Chargement..." : "Sélectionner une catégorie"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
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
      )}

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
