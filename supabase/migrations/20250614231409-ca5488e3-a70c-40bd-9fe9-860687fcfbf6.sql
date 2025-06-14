
-- Supprimer les anciennes politiques pour la table contributions
DROP POLICY IF EXISTS "Users can view their own contributions" ON public.contributions;
DROP POLICY IF EXISTS "Users can create their own contributions" ON public.contributions;
DROP POLICY IF EXISTS "Users can update their own contributions" ON public.contributions;
DROP POLICY IF EXISTS "Admins can view all contributions" ON public.contributions;
DROP POLICY IF EXISTS "Admins can manage all contributions" ON public.contributions;

-- Nouvelle politique : Les anonymes peuvent insérer des contributions
CREATE POLICY "Anonymous can create contributions"
ON public.contributions
FOR INSERT
WITH CHECK (true);

-- Politique pour permettre aux admins de voir toutes les contributions
CREATE POLICY "Admins can view all contributions"
ON public.contributions
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Politique pour permettre aux admins de modifier/supprimer toutes les contributions
CREATE POLICY "Admins can manage all contributions"
ON public.contributions
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));
