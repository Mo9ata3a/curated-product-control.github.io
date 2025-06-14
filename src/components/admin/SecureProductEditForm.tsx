
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { 
  productNameSchema, 
  brandSchema, 
  categorySchema, 
  priceSchema, 
  imageUrlSchema,
  sanitizedTextSchema,
  sanitizeError 
} from "@/lib/validation";

interface SecureProductEditFormProps {
  product: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export const SecureProductEditForm = ({
  product,
  onSuccess,
  onCancel,
}: SecureProductEditFormProps) => {
  const [formData, setFormData] = useState({
    name: product.name || "",
    marque: product.marque || "",
    categorie: product.categorie || "",
    prix: product.prix || "",
    photo_url: product.photo_url || "",
    hidden: product.hidden || false,
    eng: product.eng || "",
    globalcategory: product.globalcategory || "",
    namebic: product.namebic || "",
    article: product.article || "",
    ban: product.ban || false,
    categorieold: product.categorieold || "",
    marque_id: product.marque_id || "",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  const validateField = (field: string, value: string | boolean | number) => {
    try {
      switch (field) {
        case 'name':
          productNameSchema.parse(value);
          break;
        case 'marque':
          brandSchema.parse(value);
          break;
        case 'categorie':
          categorySchema.parse(value);
          break;
        case 'prix':
          priceSchema.parse(value);
          break;
        case 'photo_url':
          // Validation spéciale pour photo_url - permettre vide
          if (typeof value === 'string' && value.trim() === '') {
            // URL vide est valide
            break;
          }
          imageUrlSchema.parse(value);
          break;
        case 'eng':
        case 'article':
        case 'namebic':
        case 'globalcategory':
        case 'categorieold':
          if (typeof value === 'string') {
            sanitizedTextSchema.parse(value);
          }
          break;
      }
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    } catch (error: any) {
      setValidationErrors(prev => ({ 
        ...prev, 
        [field]: error.errors?.[0]?.message || 'Valeur invalide' 
      }));
    }
  };

  const { mutate: updateProduct, isPending } = useMutation({
    mutationFn: async (data: typeof formData) => {
      // Validation côté client avant envoi - avec truncation si nécessaire
      const validatedData = {
        ...data,
        name: productNameSchema.parse(data.name.slice(0, 200)), // Limiter à 200 caractères
        marque: brandSchema.parse(data.marque.slice(0, 100)), // Limiter à 100 caractères
        categorie: categorySchema.parse(data.categorie.slice(0, 100)), // Limiter à 100 caractères
        prix: priceSchema.parse(data.prix),
        photo_url: data.photo_url.trim() === '' ? null : imageUrlSchema.parse(data.photo_url),
        eng: sanitizedTextSchema.parse(data.eng.slice(0, 500)), // Limiter à 500 caractères
        article: sanitizedTextSchema.parse(data.article.slice(0, 500)), // Limiter à 500 caractères
        namebic: sanitizedTextSchema.parse(data.namebic.slice(0, 500)), // Limiter à 500 caractères
        globalcategory: sanitizedTextSchema.parse(data.globalcategory.slice(0, 500)), // Limiter à 500 caractères
        categorieold: sanitizedTextSchema.parse(data.categorieold.slice(0, 500)), // Limiter à 500 caractères
        marque_id: data.marque_id ? parseInt(data.marque_id.toString()) : null,
      };

      const { error } = await supabase
        .from("products")
        .update(validatedData)
        .eq("id", product.id);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Produit modifié avec succès !");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess();
    },
    onError: (error) => {
      console.error('Product update error:', error);
      toast.error(sanitizeError(error));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier s'il y a des erreurs de validation
    const hasErrors = Object.values(validationErrors).some(error => error !== '');
    if (hasErrors) {
      toast.error("Veuillez corriger les erreurs de validation");
      return;
    }

    updateProduct(formData);
  };

  const handleInputChange = (field: string, value: string | boolean | number) => {
    // Limiter la longueur des champs texte avant de les stocker
    if (typeof value === 'string') {
      switch (field) {
        case 'name':
          value = value.slice(0, 200);
          break;
        case 'marque':
        case 'categorie':
          value = value.slice(0, 100);
          break;
        case 'photo_url':
          value = value.slice(0, 500);
          break;
        case 'eng':
        case 'article':
        case 'namebic':
        case 'globalcategory':
        case 'categorieold':
          value = value.slice(0, 500);
          break;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    // Validation en temps réel
    if (typeof value === 'string') {
      validateField(field, value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informations de base</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du produit * ({formData.name.length}/200)</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              maxLength={200}
              required
            />
            {validationErrors.name && (
              <p className="text-red-500 text-sm">{validationErrors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="marque">Marque * ({formData.marque.length}/100)</Label>
            <Input
              id="marque"
              value={formData.marque}
              onChange={(e) => handleInputChange("marque", e.target.value)}
              maxLength={100}
              required
            />
            {validationErrors.marque && (
              <p className="text-red-500 text-sm">{validationErrors.marque}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="marque_id">ID Marque</Label>
            <Input
              id="marque_id"
              type="number"
              min="0"
              value={formData.marque_id}
              onChange={(e) => handleInputChange("marque_id", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prix">Prix</Label>
            <Input
              id="prix"
              type="number"
              step="0.01"
              min="0"
              max="99999.99"
              value={formData.prix}
              onChange={(e) => handleInputChange("prix", e.target.value)}
              placeholder="ex: 25.99"
            />
            {validationErrors.prix && (
              <p className="text-red-500 text-sm">{validationErrors.prix}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo_url">URL de l'image ({formData.photo_url.length}/500)</Label>
          <Input
            id="photo_url"
            type="url"
            value={formData.photo_url}
            onChange={(e) => handleInputChange("photo_url", e.target.value)}
            maxLength={500}
            placeholder="https://images.unsplash.com/example.jpg (optionnel)"
          />
          {validationErrors.photo_url && (
            <p className="text-red-500 text-sm">{validationErrors.photo_url}</p>
          )}
          <p className="text-xs text-gray-500">
            Domaines autorisés: images.unsplash.com, via.placeholder.com, picsum.photos (ou laisser vide)
          </p>
        </div>
      </div>

      

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Catégories</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="categorie">Catégorie * ({formData.categorie.length}/100)</Label>
            <Input
              id="categorie"
              value={formData.categorie}
              onChange={(e) => handleInputChange("categorie", e.target.value)}
              maxLength={100}
              required
            />
            {validationErrors.categorie && (
              <p className="text-red-500 text-sm">{validationErrors.categorie}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categorieold">Ancienne catégorie ({formData.categorieold.length}/500)</Label>
            <Input
              id="categorieold"
              value={formData.categorieold}
              onChange={(e) => handleInputChange("categorieold", e.target.value)}
              maxLength={500}
            />
            {validationErrors.categorieold && (
              <p className="text-red-500 text-sm">{validationErrors.categorieold}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="globalcategory">Catégorie globale ({formData.globalcategory.length}/500)</Label>
            <Input
              id="globalcategory"
              value={formData.globalcategory}
              onChange={(e) => handleInputChange("globalcategory", e.target.value)}
              maxLength={500}
            />
            {validationErrors.globalcategory && (
              <p className="text-red-500 text-sm">{validationErrors.globalcategory}</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Descriptions</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="article">Article ({formData.article.length}/500)</Label>
            <Textarea
              id="article"
              value={formData.article}
              onChange={(e) => handleInputChange("article", e.target.value)}
              maxLength={500}
              rows={3}
            />
            {validationErrors.article && (
              <p className="text-red-500 text-sm">{validationErrors.article}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="eng">Description anglaise ({formData.eng.length}/500)</Label>
            <Textarea
              id="eng"
              value={formData.eng}
              onChange={(e) => handleInputChange("eng", e.target.value)}
              maxLength={500}
              rows={3}
            />
            {validationErrors.eng && (
              <p className="text-red-500 text-sm">{validationErrors.eng}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="namebic">Nom BIC ({formData.namebic.length}/500)</Label>
            <Input
              id="namebic"
              value={formData.namebic}
              onChange={(e) => handleInputChange("namebic", e.target.value)}
              maxLength={500}
            />
            {validationErrors.namebic && (
              <p className="text-red-500 text-sm">{validationErrors.namebic}</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Statut</h3>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="hidden"
              checked={formData.hidden}
              onCheckedChange={(checked) => handleInputChange("hidden", checked)}
            />
            <Label htmlFor="hidden">Produit caché</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="ban"
              checked={formData.ban}
              onCheckedChange={(checked) => handleInputChange("ban", checked)}
            />
            <Label htmlFor="ban">Produit banni</Label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Modification..." : "Modifier"}
        </Button>
      </div>
    </form>
  );
};
