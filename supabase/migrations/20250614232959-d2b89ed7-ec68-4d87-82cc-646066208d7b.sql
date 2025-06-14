
-- Étape 1: Nettoyage des politiques RLS conflictuelles sur contributions
DROP POLICY IF EXISTS "Anonymous can create contributions" ON public.contributions;
DROP POLICY IF EXISTS "Admins can view all contributions" ON public.contributions;
DROP POLICY IF EXISTS "Admins can manage all contributions" ON public.contributions;

-- Étape 2: Politiques RLS strictes pour contributions
-- Anonymes peuvent créer des contributions (pour les soumissions publiques)
CREATE POLICY "Anonymous can create contributions"
ON public.contributions
FOR INSERT
WITH CHECK (true);

-- Seuls les admins peuvent voir toutes les contributions
CREATE POLICY "Admins can view all contributions"
ON public.contributions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid()
  )
);

-- Seuls les admins peuvent modifier/supprimer les contributions
CREATE POLICY "Admins can update contributions"
ON public.contributions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins can delete contributions"
ON public.contributions
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid()
  )
);

-- Étape 3: Sécurisation de la table products
-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can view products" ON public.products;
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;

-- Lecture publique limitée pour les produits (pour l'affichage frontend)
CREATE POLICY "Public can view non-hidden products"
ON public.products
FOR SELECT
USING (hidden IS NULL OR hidden = false);

-- Seuls les admins peuvent modifier les produits
CREATE POLICY "Admins can manage products"
ON public.products
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid()
  )
);

-- Étape 4: Sécurisation de la table brands
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour les marques (nécessaire pour l'affichage)
CREATE POLICY "Public can view brands"
ON public.brands
FOR SELECT
USING (true);

-- Seuls les admins peuvent modifier les marques
CREATE POLICY "Admins can manage brands"
ON public.brands
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid()
  )
);

-- Étape 5: Sécurisation de la table bignos
ALTER TABLE public.bignos ENABLE ROW LEVEL SECURITY;

-- Lecture publique pour bignos (pour l'affichage des alternatives)
CREATE POLICY "Public can view bignos"
ON public.bignos
FOR SELECT
USING (hidden IS NULL OR hidden = false);

-- Seuls les admins peuvent modifier bignos
CREATE POLICY "Admins can manage bignos"
ON public.bignos
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid()
  )
);

-- Étape 6: Création d'une table d'audit pour le monitoring
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  operation text NOT NULL,
  user_email text,
  old_data jsonb,
  new_data jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS pour audit_log - seuls les admins peuvent voir les logs
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
ON public.audit_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid()
  )
);

-- Fonction de trigger pour l'audit
CREATE OR REPLACE FUNCTION public.log_audit()
RETURNS trigger AS $$
BEGIN
  INSERT INTO audit_log(table_name, operation, user_email, old_data, new_data)
  VALUES (
    TG_TABLE_NAME,
    TG_OP,
    current_setting('request.jwt.claims', true)::json->>'email',
    to_jsonb(OLD),
    to_jsonb(NEW)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers d'audit sur les tables critiques
DROP TRIGGER IF EXISTS audit_products_trigger ON public.products;
CREATE TRIGGER audit_products_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.products
  FOR EACH ROW EXECUTE FUNCTION log_audit();

DROP TRIGGER IF EXISTS audit_brands_trigger ON public.brands;
CREATE TRIGGER audit_brands_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.brands
  FOR EACH ROW EXECUTE FUNCTION log_audit();

DROP TRIGGER IF EXISTS audit_contributions_trigger ON public.contributions;
CREATE TRIGGER audit_contributions_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.contributions
  FOR EACH ROW EXECUTE FUNCTION log_audit();
