
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

const productFormSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  marque: z.string().min(2, { message: "La marque doit contenir au moins 2 caractères." }),
  categorie: z.string().min(2, { message: "La catégorie doit contenir au moins 2 caractères." }),
  prix: z.string().refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: "Le prix doit être un nombre positif." }),
  photo_url: z.string().url({ message: "Veuillez entrer une URL d'image valide." }).optional().or(z.literal('')),
  hidden: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  onSuccess: () => void;
}

export const ProductForm = ({ onSuccess }: ProductFormProps) => {
  const { toast } = useToast();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
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

  const onSubmit = async (data: ProductFormValues) => {
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
      toast({
        variant: "destructive",
        title: "Erreur",
        description: `Une erreur est survenue: ${error.message}`,
      });
    } else {
      toast({
        title: "Succès!",
        description: "Le produit a été ajouté avec succès.",
      });
      onSuccess();
      form.reset();
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
                <Input placeholder="Ex: Savon de Marseille" {...field} />
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
                <Input placeholder="Ex: Le Petit Marseillais" {...field} />
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
                <Input placeholder="Ex: Hygiène" {...field} />
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
                <Input type="number" step="0.01" {...field} />
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
                <Input placeholder="https://exemple.com/image.png" {...field} />
              </FormControl>
              <FormMessage />
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
