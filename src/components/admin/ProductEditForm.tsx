
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

interface ProductEditFormProps {
  product: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProductEditForm = ({
  product,
  onSuccess,
  onCancel,
}: ProductEditFormProps) => {
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

  const queryClient = useQueryClient();

  const { mutate: updateProduct, isPending } = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from("products")
        .update({
          ...data,
          marque_id: data.marque_id ? parseInt(data.marque_id.toString()) : null,
        })
        .eq("id", product.id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      toast.success("Produit modifié avec succès !");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Erreur lors de la modification : ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct(formData);
  };

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Informations de base</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du produit</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="marque">Marque</Label>
            <Input
              id="marque"
              value={formData.marque}
              onChange={(e) => handleInputChange("marque", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="marque_id">ID Marque</Label>
            <Input
              id="marque_id"
              type="number"
              value={formData.marque_id}
              onChange={(e) => handleInputChange("marque_id", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prix">Prix</Label>
            <Input
              id="prix"
              value={formData.prix}
              onChange={(e) => handleInputChange("prix", e.target.value)}
              placeholder="ex: 25.99"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="photo_url">URL de l'image</Label>
          <Input
            id="photo_url"
            type="url"
            value={formData.photo_url}
            onChange={(e) => handleInputChange("photo_url", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Catégories</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="categorie">Catégorie</Label>
            <Input
              id="categorie"
              value={formData.categorie}
              onChange={(e) => handleInputChange("categorie", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categorieold">Ancienne catégorie</Label>
            <Input
              id="categorieold"
              value={formData.categorieold}
              onChange={(e) => handleInputChange("categorieold", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="globalcategory">Catégorie globale</Label>
            <Input
              id="globalcategory"
              value={formData.globalcategory}
              onChange={(e) => handleInputChange("globalcategory", e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Descriptions</h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="article">Article</Label>
            <Textarea
              id="article"
              value={formData.article}
              onChange={(e) => handleInputChange("article", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="eng">Description anglaise</Label>
            <Textarea
              id="eng"
              value={formData.eng}
              onChange={(e) => handleInputChange("eng", e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="namebic">Nom BIC</Label>
            <Input
              id="namebic"
              value={formData.namebic}
              onChange={(e) => handleInputChange("namebic", e.target.value)}
            />
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
