
import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { BignosFormData } from "./form/types";

interface SecureBignosFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const SecureBignosForm = ({ onSuccess, onCancel }: SecureBignosFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<BignosFormData>({
    resolver: zodResolver(bignosSchema),
    defaultValues: {
      name: "",
      marque: "",
      categorie: "",
      prix: "",
      photo_url: "",
      article: "",
      globalcategory: "",
      namebic: "",
      categorieold: "",
    },
  });

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
        hidden: false,
        ban: false,
      };

      const { error } = await supabase
        .from("bignos")
        .insert([cleanedData]);

      if (error) {
        throw new Error(sanitizeError(error));
      }

      toast.success("Bigno créé avec succès !");
      reset();
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
          <Shield className="h-5 w-5 text-green-600" />
          Ajouter un nouveau bigno (Mode sécurisé)
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
          <TextFields register={register} errors={errors} />
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
              {isSubmitting ? "Création..." : "Créer le bigno"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
