
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { bignosSchema, sanitizeError } from "@/lib/validation";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { ImageSection } from "./form/ImageSection";
import { TextFields } from "./form/TextFields";
import { Bignos, BignosFormData } from "./form/types";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface SecureBignosEditFormProps {
  bigno: Bignos;
  onSuccess: () => void;
  onCancel: () => void;
}

export const SecureBignosEditForm = ({ bigno, onSuccess, onCancel }: SecureBignosEditFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<BignosFormData>({
    resolver: zodResolver(bignosSchema),
    defaultValues: {
      name: bigno.name ?? "",
      marque: bigno.marque ?? "",
      categorie: bigno.categorie ?? "",
      prix: bigno.prix ?? "",
      photo_url: bigno.photo_url ?? "",
      article: bigno.article ?? "",
      globalcategory: bigno.globalcategory ?? "",
      namebic: bigno.namebic ?? "",
      categorieold: bigno.categorieold ?? "",
      hidden: bigno.hidden ?? false,
      ban: bigno.ban ?? false,
    },
  });
  
  useEffect(() => {
    reset({
      name: bigno.name ?? "",
      marque: bigno.marque ?? "",
      categorie: bigno.categorie ?? "",
      prix: bigno.prix ?? "",
      photo_url: bigno.photo_url ?? "",
      article: bigno.article ?? "",
      globalcategory: bigno.globalcategory ?? "",
      namebic: bigno.namebic ?? "",
      categorieold: bigno.categorieold ?? "",
      hidden: bigno.hidden ?? false,
      ban: bigno.ban ?? false,
    });
  }, [bigno, reset]);

  const photoUrl = watch("photo_url");

  const handleImageUpload = (url: string) => {
    setValue("photo_url", url, { shouldValidate: true });
  };

  const onSubmit = async (data: BignosFormData) => {
    setIsSubmitting(true);
    setValidationErrors([]);

    try {
      const cleanedData = {
        ...bignosSchema.parse(data),
        photo_url: data.photo_url?.trim() === '' ? null : data.photo_url?.trim(),
      };

      const { error } = await supabase
        .from("bignos")
        .update(cleanedData)
        .eq('id', bigno.id);

      if (error) {
        throw new Error(sanitizeError(error));
      }

      toast.success("Bigno mis à jour avec succès !");
      onSuccess();
    } catch (error) {
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
          <Shield className="h-5 w-5 text-blue-600" />
          Modifier un bigno (Mode sécurisé)
        </CardTitle>
        <CardDescription>
          Formulaire sécurisé pour l'édition de bignos
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
          <TextFields register={register} errors={errors} />

          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Statut</h3>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Controller
                  name="hidden"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="hidden"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  )}
                />
                <Label htmlFor="hidden">Caché</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Controller
                  name="ban"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="ban"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isSubmitting}
                    />
                  )}
                />
                <Label htmlFor="ban">Banni</Label>
              </div>
            </div>
            {errors.hidden && <p className="text-sm text-red-500">{errors.hidden.message}</p>}
            {errors.ban && <p className="text-sm text-red-500">{errors.ban.message}</p>}
          </div>

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
            >
              {isSubmitting ? "Mise à jour..." : "Mettre à jour le bigno"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
