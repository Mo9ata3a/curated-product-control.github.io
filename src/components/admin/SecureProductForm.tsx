
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { 
  productNameSchema, 
  brandSchema, 
  categorySchema, 
  priceSchema, 
  imageUrlSchema,
  sanitizeError 
} from "@/lib/validation";

const secureProductFormSchema = z.object({
  name: productNameSchema,
  marque: brandSchema,
  categorie: categorySchema,
  prix: priceSchema,
  photo_url: imageUrlSchema,
  hidden: z.boolean().default(false),
});

type SecureProductFormValues = z.infer<typeof secureProductFormSchema>;

interface SecureProductFormProps {
  onSuccess: () => void;
}

export const SecureProductForm = ({ onSuccess }: SecureProductFormProps) => {
  const { toast } = useToast();
  const form = useForm<SecureProductFormValues>({
    resolver: zodResolver(secureProductFormSchema),
    defaultValues: {
      name: "",
      marque: "",
      categorie: "",
      prix: "0",
      photo_url: "",
      hidden: false,
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: SecureProductFormValues) => {
    try {
      const { error } = await supabase.from("products").insert([
        {
          name: data.name,
          marque: data.marque,
          categorie: data.categorie,
          prix: data.prix,
          photo_url: data.photo_url || null,
          hidden: data.hidden,
        },
      ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Succès!",
        description: "Le produit a été ajouté avec succès.",
      });
      onSuccess();
      form.reset();
    } catch (error) {
      console.error('Product creation error:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: sanitizeError(error),
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du produit</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Savon de Marseille" 
                  {...field}
                  maxLength={200}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="marque"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marque</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Le Petit Marseillais" 
                  {...field}
                  maxLength={100}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categorie"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: Hygiène" 
                  {...field}
                  maxLength={100}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="prix"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prix</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  min="0"
                  max="99999.99"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="photo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de la photo</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://images.unsplash.com/example.jpg" 
                  {...field}
                  maxLength={500}
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-gray-500">
                Domaines autorisés: images.unsplash.com, via.placeholder.com, picsum.photos
              </p>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hidden"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Cacher le produit</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enregistrer le produit
        </Button>
      </form>
    </Form>
  );
};
