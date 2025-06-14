
import * as z from "zod";

// Liste blanche de domaines autorisés pour les URLs d'images
const ALLOWED_IMAGE_DOMAINS = [
  'images.unsplash.com',
  'via.placeholder.com',
  'picsum.photos',
  'example.com',
  'cdn.example.com'
];

// Schéma de validation pour les URLs d'images - sans validation
export const imageUrlSchema = z.string().optional();

// Schéma de validation pour les prix - avec nettoyage des espaces
export const priceSchema = z.string()
  .transform((val) => val.trim())
  .refine((val) => {
    if (val === '') return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 99999.99;
  }, { message: "Le prix doit être un nombre positif valide (max 99999.99)" });

// Schéma de validation pour les textes avec sanitisation
export const sanitizedTextSchema = z.string()
  .max(500, { message: "Le texte ne peut pas dépasser 500 caractères" })
  .transform((val) => {
    // Suppression des balises HTML potentiellement dangereuses
    return val.replace(/<script[^>]*>.*?<\/script>/gi, '')
              .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
              .replace(/<object[^>]*>.*?<\/object>/gi, '')
              .replace(/<embed[^>]*>/gi, '')
              .replace(/javascript:/gi, '')
              .replace(/on\w+\s*=/gi, '')
              .trim();
  });

// Schéma de validation pour les noms de produits
export const productNameSchema = z.string()
  .min(1, { message: "Le nom du produit est requis" })
  .max(200, { message: "Le nom ne peut pas dépasser 200 caractères" })
  .transform((val) => sanitizedTextSchema.parse(val));

// Schéma de validation pour les marques
export const brandSchema = z.string()
  .min(1, { message: "La marque est requise" })
  .max(100, { message: "La marque ne peut pas dépasser 100 caractères" })
  .transform((val) => sanitizedTextSchema.parse(val));

// Schéma de validation pour les catégories
export const categorySchema = z.string()
  .min(1, { message: "La catégorie est requise" })
  .max(100, { message: "La catégorie ne peut pas dépasser 100 caractères" })
  .transform((val) => sanitizedTextSchema.parse(val));

// Fonction utilitaire pour sanitiser les erreurs
export const sanitizeError = (error: any): string => {
  // Ne jamais exposer les détails techniques des erreurs Supabase
  if (error?.message?.includes('RLS')) {
    return "Accès non autorisé";
  }
  if (error?.message?.includes('JWT')) {
    return "Session expirée, veuillez vous reconnecter";
  }
  if (error?.message?.includes('duplicate key')) {
    return "Cette donnée existe déjà";
  }
  if (error?.message?.includes('foreign key')) {
    return "Référence invalide";
  }
  
  // Message générique pour toute autre erreur
  return "Une erreur est survenue. Veuillez réessayer.";
};

// Validation pour les contributions
export const contributionSchema = z.object({
  product_name: productNameSchema.optional(),
  alt_name: productNameSchema.optional(),
  alt_description: sanitizedTextSchema.optional(),
  alt_image: imageUrlSchema.optional(),
  rating: z.number().min(1).max(5).optional()
});
