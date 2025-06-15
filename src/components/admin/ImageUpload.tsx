
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageUploadProps {
  currentUrl?: string;
  onImageUpload: (url: string) => void;
  disabled?: boolean;
}

export const ImageUpload = ({ currentUrl, onImageUpload, disabled }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);

      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload du fichier
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obtenir l'URL publique
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      setPreview(publicUrl);
      onImageUpload(publicUrl);
      toast.success("Image uploadée avec succès !");

    } catch (error: any) {
      console.error('Erreur upload:', error);
      toast.error(`Erreur lors de l'upload: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez sélectionner un fichier image");
      return;
    }

    // Vérifier la taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5MB");
      return;
    }

    uploadImage(file);
  };

  const removeImage = () => {
    setPreview(null);
    onImageUpload("");
  };

  return (
    <div className="space-y-4">
      <Label>Image du produit</Label>
      
      {preview ? (
        <div className="relative inline-block">
          <img 
            src={preview} 
            alt="Aperçu" 
            className="w-32 h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={removeImage}
            disabled={disabled}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-2">
            <Label htmlFor="image-upload" className="cursor-pointer">
              <div className="text-sm text-gray-600">
                Cliquez pour sélectionner une image
              </div>
              <div className="text-xs text-gray-500 mt-1">
                PNG, JPG, WEBP, GIF jusqu'à 5MB
              </div>
            </Label>
          </div>
        </div>
      )}

      <Input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading || disabled}
        className="hidden"
      />

      <Button
        type="button"
        variant="outline"
        onClick={() => document.getElementById('image-upload')?.click()}
        disabled={uploading || disabled}
        className="w-full"
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? "Upload en cours..." : "Choisir une image"}
      </Button>
    </div>
  );
};
