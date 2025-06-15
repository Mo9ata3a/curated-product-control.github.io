
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

interface TextFieldsProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export const TextFields = ({ register, errors }: TextFieldsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="article">Article</Label>
        <Textarea
          id="article"
          {...register("article")}
          placeholder="Description de l'article"
          maxLength={500}
          rows={3}
        />
        {errors.article && (
          <p className="text-sm text-red-500">{errors.article.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="eng">Nom anglais</Label>
        <Textarea
          id="eng"
          {...register("eng")}
          placeholder="Nom en anglais"
          maxLength={500}
          rows={3}
        />
        {errors.eng && (
          <p className="text-sm text-red-500">{errors.eng.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="globalcategory">Catégorie globale</Label>
        <Input
          id="globalcategory"
          {...register("globalcategory")}
          placeholder="Catégorie globale"
          maxLength={500}
        />
        {errors.globalcategory && (
          <p className="text-sm text-red-500">{errors.globalcategory.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="namebic">Nom BIC</Label>
        <Input
          id="namebic"
          {...register("namebic")}
          placeholder="Nom BIC"
          maxLength={500}
        />
        {errors.namebic && (
          <p className="text-sm text-red-500">{errors.namebic.message}</p>
        )}
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="categorieold">Ancienne catégorie</Label>
        <Input
          id="categorieold"
          {...register("categorieold")}
          placeholder="Ancienne catégorie"
          maxLength={500}
        />
        {errors.categorieold && (
          <p className="text-sm text-red-500">{errors.categorieold.message}</p>
        )}
      </div>
    </div>
  );
};
