
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "../ImageUpload";

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

interface ImageSectionProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  photoUrl: string;
  onImageUpload: (url: string) => void;
  isSubmitting: boolean;
}

export const ImageSection = ({ 
  register, 
  errors, 
  photoUrl, 
  onImageUpload, 
  isSubmitting 
}: ImageSectionProps) => {
  return (
    <>
      {/* URL d'image */}
      <div className="space-y-2">
        <Label htmlFor="photo_url">URL de l'image</Label>
        <Input
          id="photo_url"
          {...register("photo_url")}
          placeholder="https://example.com/image.jpg"
          type="url"
        />
        {errors.photo_url && (
          <p className="text-sm text-red-500">{errors.photo_url.message}</p>
        )}
        {photoUrl && (
          <div className="mt-2">
            <img 
              src={photoUrl} 
              alt="Aperçu" 
              className="w-32 h-32 object-cover rounded-lg border"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>

      {/* Upload d'image */}
      <div className="md:col-span-2">
        <ImageUpload
          currentUrl={photoUrl}
          onImageUpload={onImageUpload}
          disabled={isSubmitting}
        />
      </div>
    </>
  );
};
