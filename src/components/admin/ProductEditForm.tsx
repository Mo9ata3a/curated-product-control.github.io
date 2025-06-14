
import { useState, useEffect } from "react";
import { Product } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

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
  });

  const queryClient = useQueryClient();

  const { mutate: updateProduct, isPending } = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from("products")
        .update(data)
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
        <Label htmlFor="categorie">Catégorie</Label>
        <Input
          id="categorie"
          value={formData.categorie}
          onChange={(e) => handleInputChange("categorie", e.target.value)}
          required
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

      <div className="flex items-center space-x-2">
        <Switch
          id="hidden"
          checked={formData.hidden}
          onCheckedChange={(checked) => handleInputChange("hidden", checked)}
        />
        <Label htmlFor="hidden">Produit caché</Label>
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
