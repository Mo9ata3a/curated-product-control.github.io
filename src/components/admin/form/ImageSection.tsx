
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "../ImageUpload";
import { ProductFormData } from "./types";

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
