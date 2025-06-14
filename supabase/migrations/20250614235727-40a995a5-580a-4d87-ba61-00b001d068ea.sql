
-- ÉTAPE 1: Nettoyage complet des politiques RLS conflictuelles

-- ===== NETTOYAGE DE LA TABLE PRODUCTS =====
DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can view products" ON public.products;
DROP POLICY IF EXISTS "Users can view their own products" ON public.products;
DROP POLICY IF EXISTS "Public can view non-hidden products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

-- Nouvelle politique claire pour products: lecture publique des produits non cachés
CREATE POLICY "Public read non-hidden products"
ON public.products
FOR SELECT
USING (hidden IS NULL OR hidden = false);

-- Admins peuvent tout faire sur products
CREATE POLICY "Admins full access products"
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

-- ===== NETTOYAGE DE LA TABLE CONTRIBUTIONS =====
DROP POLICY IF EXISTS "Anonymous can create contributions" ON public.contributions;
DROP POLICY IF EXISTS "Admins can view all contributions" ON public.contributions;
DROP POLICY IF EXISTS "Admins can manage all contributions" ON public.contributions;
DROP POLICY IF EXISTS "Admins can update contributions" ON public.contributions;
DROP POLICY IF EXISTS "Admins can delete contributions" ON public.contributions;

-- Nouvelles politiques claires pour contributions
-- Anonymes peuvent créer des contributions
CREATE POLICY "Public create contributions"
ON public.contributions
FOR INSERT
WITH CHECK (true);

-- Seuls les admins peuvent voir toutes les contributions
CREATE POLICY "Admins read all contributions"
ON public.contributions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid()
  )
);

-- Admins peuvent modifier et supprimer
CREATE POLICY "Admins modify contributions"
ON public.contributions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Admins delete contributions"
ON public.contributions
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid()
  )
);

-- ===== NETTOYAGE DE LA TABLE BRANDS =====
DROP POLICY IF EXISTS "Public can view brands" ON public.brands;
DROP POLICY IF EXISTS "Admins can manage brands" ON public.brands;

-- Nouvelles politiques pour brands
CREATE POLICY "Public read brands"
ON public.brands
FOR SELECT
USING (true);

CREATE POLICY "Admins full access brands"
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

-- ===== NETTOYAGE DE LA TABLE BIGNOS =====
DROP POLICY IF EXISTS "Public can view bignos" ON public.bignos;
DROP POLICY IF EXISTS "Admins can manage bignos" ON public.bignos;

-- Nouvelles politiques pour bignos
CREATE POLICY "Public read non-hidden bignos"
ON public.bignos
FOR SELECT
USING (hidden IS NULL OR hidden = false);

CREATE POLICY "Admins full access bignos"
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

-- ===== AMÉLIORATION DU MONITORING DE SÉCURITÉ =====
-- Fonction pour logger les tentatives d'accès non autorisées
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type text,
  table_name text,
  user_id uuid DEFAULT auth.uid(),
  details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO audit_log(table_name, operation, user_email, old_data, new_data)
  VALUES (
    table_name,
    'SECURITY_EVENT',
    COALESCE(
      current_setting('request.jwt.claims', true)::json->>'email',
      'anonymous'
    ),
    jsonb_build_object('event_type', event_type, 'user_id', user_id),
    details
  );
END;
$$;
