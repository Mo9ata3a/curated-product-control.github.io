
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Upload, Shield } from "lucide-react";
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
      
      // Vérifier l'URL si fournie
      if (data.photo_url) {
        try {
          const url = new URL(data.photo_url);
          if (url.protocol !== 'https:') {
            errors.push("L'URL de l'image doit utiliser HTTPS");
          }
        } catch {
          errors.push("URL d'image invalide");
        }
      }

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

            {/* URL de l'image */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="photo_url">URL de l'image (HTTPS uniquement)</Label>
              <div className="flex items-center space-x-2">
                <Upload className="h-4 w-4 text-gray-400" />
                <Input
                  id="photo_url"
                  {...register("photo_url")}
                  placeholder="https://images.example.com/photo.jpg"
                  type="url"
                />
              </div>
              {errors.photo_url && (
                <p className="text-sm text-red-500">{errors.photo_url.message}</p>
              )}
              {photoUrl && (
                <p className="text-xs text-gray-500">
                  Aperçu : {photoUrl.slice(0, 50)}{photoUrl.length > 50 ? '...' : ''}
                </p>
              )}
            </div>
          </div>

          {/* Champs de texte longs */}
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
