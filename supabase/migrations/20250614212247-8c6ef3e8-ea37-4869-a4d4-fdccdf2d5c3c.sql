
-- Enable Row Level Security (RLS) for critical tables.
-- This is a key security measure to control who can access or modify data, without altering existing data.

-- Secure the 'products' table so only authenticated admins can manage them.
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all products"
ON public.products
FOR ALL
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- Secure the 'admins' table to control who can be an admin.
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Allow admins to see who else is an admin.
CREATE POLICY "Admins can view other admins"
ON public.admins
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Only allow existing admins to add new admins.
CREATE POLICY "Admins can create new admins"
ON public.admins
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

-- For added security, prevent modification or deletion of admins via the API.
-- These actions should be performed directly in the database by a super-admin.
CREATE POLICY "Prevent admin updates from API"
ON public.admins
FOR UPDATE
USING (false);

CREATE POLICY "Prevent admin deletion from API"
ON public.admins
FOR DELETE
USING (false);
