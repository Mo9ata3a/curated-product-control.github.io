
-- Correction des politiques RLS pour audit_log
-- Le trigger d'audit doit pouvoir écrire dans audit_log sans restriction RLS

-- Supprimer l'ancienne politique qui bloque les insertions
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_log;

-- Créer une politique qui permet aux admins de voir les logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_log
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = auth.uid()
  )
);

-- Permettre au trigger d'audit d'insérer sans restriction RLS
-- en utilisant une fonction SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.log_audit()
RETURNS trigger 
SECURITY DEFINER -- Cette fonction s'exécute avec les privilèges du propriétaire
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insérer directement sans vérification RLS grâce à SECURITY DEFINER
  INSERT INTO audit_log(table_name, operation, user_email, old_data, new_data)
  VALUES (
    TG_TABLE_NAME,
    TG_OP,
    COALESCE(
      current_setting('request.jwt.claims', true)::json->>'email',
      'system'
    ),
    CASE WHEN TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;
