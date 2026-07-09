
-- Auto-grant 'author' role to new users, and backfill existing users without any role.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  author_role_id uuid;
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  )
  ON CONFLICT (id) DO NOTHING;

  SELECT id INTO author_role_id FROM public.roles WHERE key = 'author';
  IF author_role_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role_id, granted_by)
    VALUES (NEW.id, author_role_id, NEW.id)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Backfill: assign 'author' role to any existing user that has no role at all.
INSERT INTO public.user_roles (user_id, role_id, granted_by)
SELECT u.id, r.id, u.id
FROM auth.users u
CROSS JOIN public.roles r
WHERE r.key = 'author'
  AND NOT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = u.id)
ON CONFLICT DO NOTHING;
