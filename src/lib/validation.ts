import * as z from "zod";

// Liste blanche de domaines autorisés pour les URLs d'images
const ALLOWED_IMAGE_DOMAINS = [
  'images.unsplash.com',
  'via.placeholder.com',
  'picsum.photos',
  'cdn.example.com',
  // Domaines de confiance pour les images
  'www.google.com',
  'encrypted-tbn0.gstatic.com',
  'lh3.googleusercontent.com',
  // Domaines Supabase Storage
  'hpgpjnsmplqeatpmtqna.supabase.co',
  'supabase.co',
  // Autres domaines de stockage cloud populaires
  'amazonaws.com',
  'cloudinary.com',
  'imgur.com'
];

// Schéma de validation pour les URLs d'images - SANS validation stricte
export const imageUrlSchema = z.string()
  .optional()
  .refine((url) => {
    if (!url || url.trim() === '') return true;
    
    // Vérifier que c'est une URL valide
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }, { 
    message: "URL d'image invalide" 
  });

// Schéma de validation pour les prix - avec nettoyage des espaces
export const priceSchema = z.string()
  .transform((val) => val.trim())
  .refine((val) => {
    if (val === '') return true;
    
    // Vérifier le format numérique strict
    const numPattern = /^\d+(\.\d{1,2})?$/;
    if (!numPattern.test(val)) return false;
    
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 99999.99;
  }, { message: "Le prix doit être un nombre positif valide avec maximum 2 décimales (max 99999.99)" });

// Schéma de validation pour les textes avec sanitisation renforcée
export const sanitizedTextSchema = z.string()
  .max(500, { message: "Le texte ne peut pas dépasser 500 caractères" })
  .transform((val) => {
    // Suppression stricte de tout contenu potentiellement dangereux
    return val
      .replace(/<script[^>]*>.*?<\/script>/gis, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gis, '')
      .replace(/<object[^>]*>.*?<\/object>/gis, '')
      .replace(/<embed[^>]*>/gi, '')
      .replace(/<link[^>]*>/gi, '')
      .replace(/<meta[^>]*>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/expression\s*\(/gi, '')
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

// Schéma de validation pour bignos
export const bignosSchema = z.object({
  name: productNameSchema,
  marque: brandSchema,
  categorie: categorySchema,
  prix: priceSchema,
  photo_url: imageUrlSchema,
  article: sanitizedTextSchema,
  globalcategory: sanitizedTextSchema,
  namebic: sanitizedTextSchema,
  categorieold: sanitizedTextSchema,
});

// Fonction utilitaire pour sanitiser les erreurs - améliorée
export const sanitizeError = (error: any): string => {
  console.error('Error details:', error); // Log pour debug (côté développeur)
  
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
  if (error?.message?.includes('permission denied')) {
    return "Permissions insuffisantes";
  }
  
  // Message générique pour toute autre erreur
  return "Une erreur est survenue. Veuillez réessayer.";
};

// Validation pour les contributions - renforcée
export const contributionSchema = z.object({
  product_name: productNameSchema.optional(),
  alt_name: productNameSchema.optional(),
  alt_description: sanitizedTextSchema.optional(),
  alt_image: imageUrlSchema,
  rating: z.number().min(1).max(5).optional()
});

// Nouveau : Schéma pour valider les données d'audit
export const auditDataSchema = z.object({
  table_name: z.string().min(1).max(50),
  operation: z.enum(['INSERT', 'UPDATE', 'DELETE', 'SECURITY_EVENT']),
  user_email: z.string().email().optional(),
  old_data: z.any().optional(),
  new_data: z.any().optional()
});

// Nouveau : Fonction pour valider les paramètres de recherche
export const validateSearchTerm = (term: string): string => {
  if (!term || typeof term !== 'string') {
    return '';
  }
  
  // Limiter la longueur et nettoyer
  const cleaned = term
    .trim()
    .slice(0, 100) // Limite raisonnable
    .replace(/[<>]/g, '') // Supprimer les caractères dangereux
    .replace(/\s+/g, ' '); // Normaliser les espaces
    
  return cleaned;
};
