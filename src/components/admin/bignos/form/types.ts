
export interface Bignos {
  id: number;
  name: string | null;
  marque: string | null;
  categorie: string | null;
  prix: string | null;
  photo_url: string | null;
  article: string | null;
  globalcategory: string | null;
  namebic: string | null;
  categorieold: string | null;
  hidden: boolean | null;
  ban: boolean | null;
  alternatives: any;
  alternativesb: any;
}

export interface BignosFormData {
  name: string;
  marque: string;
  categorie: string;
  prix: string;
  photo_url: string;
  article: string;
  globalcategory: string;
  namebic: string;
  categorieold: string;
}
