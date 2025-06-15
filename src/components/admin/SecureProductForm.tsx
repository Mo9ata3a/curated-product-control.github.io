
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  productNameSchema, 
  brandSchema, 
  categorySchema, 
  priceSchema, 
  imageUrlSchema,
  sanitizedTextSchema,
  sanitizeError 
} from "@/lib/validation";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { ImageSection } from "./form/ImageSection";
import { TextFields } from "./form/TextFields";

// Schéma de validation complet pour le formulaire
const productSchema = z.object({
  name: productNameSchema,
  marque: brandSchema,
  categorie: categorySchema,
  prix: priceSchema,
  photo_url: imageUrlSchema,
  eng: sanitizedTextSchema,
  article: sanitizedTextSchema,
  globalcategory: sanitizedTextSchema,
  namebic: sanitizedTextSchema,
  categorieold: sanitizedTextSchema,
});

type ProductFormData = z.infer<typeof productSchema>;

interface SecureProductFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const SecureProductForm = ({ onSuccess, onCancel }: SecureProductFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      marque: "",
      categorie: "",
      prix: "",
      photo_url: "",
      eng: "",
      article: "",
      globalcategory: "",
      namebic: "",
      categorieold: "",
    },
  });

  // Surveiller l'URL de l'image pour validation en temps réel
  const photoUrl = watch("photo_url");

  const handleImageUpload = (url: string) => {
    setValue("photo_url", url, { shouldValidate: true });
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      // Validation supplémentaire côté client
      const errors: string[] = [];
      
      // Vérifier la longueur des champs
      if (data.name.length > 200) errors.push("Le nom est trop long");
      if (data.marque.length > 100) errors.push("La marque est trop longue");
      if (data.categorie.length > 100) errors.push("La catégorie est trop longue");

      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }

      // Préparer les données nettoyées
      const cleanedData = {
        name: productNameSchema.parse(data.name),
        marque: brandSchema.parse(data.marque),
        categorie: categorySchema.parse(data.categorie),
        prix: priceSchema.parse(data.prix),
        photo_url: data.photo_url?.trim() === '' ? null : data.photo_url?.trim(),
        eng: sanitizedTextSchema.parse(data.eng),
        article: sanitizedTextSchema.parse(data.article),
        globalcategory: sanitizedTextSchema.parse(data.globalcategory),
        namebic: sanitizedTextSchema.parse(data.namebic),
        categorieold: sanitizedTextSchema.parse(data.categorieold),
        hidden: false,
        ban: false,
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("products")
        .insert([cleanedData]);

      if (error) {
        console.error('Database error:', error);
        throw new Error(sanitizeError(error));
      }

      toast.success("Produit créé avec succès !");
      reset();
      onSuccess();
    } catch (error) {
      console.error('Form submission error:', error);
      const errorMessage = sanitizeError(error);
      toast.error(errorMessage);
      setValidationErrors([errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          Ajouter un nouveau produit (Mode sécurisé)
        </CardTitle>
        <CardDescription>
          Formulaire sécurisé avec validation stricte des données
        </CardDescription>
      </CardHeader>
      <CardContent>
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <BasicInfoFields register={register} errors={errors} />
          
          <ImageSection 
            register={register} 
            errors={errors}
            photoUrl={photoUrl}
            onImageUpload={handleImageUpload}
            isSubmitting={isSubmitting}
          />

          {/* Champs de texte longs */}
          <TextFields register={register} errors={errors} />

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-2 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Création..." : "Créer le produit"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
