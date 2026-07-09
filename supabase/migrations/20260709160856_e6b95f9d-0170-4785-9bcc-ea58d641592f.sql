
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.generate_manuscript_id()
RETURNS TEXT LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  yr INT := EXTRACT(YEAR FROM now());
  n  INT := nextval('public.manuscript_seq');
BEGIN
  RETURN 'OTA-' || yr::TEXT || '-' || LPAD(n::TEXT, 4, '0');
END; $$;

REVOKE ALL ON FUNCTION public.has_permission(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.has_role(UUID, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.is_assigned_editor(UUID, UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.generate_manuscript_id() FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.has_permission(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_assigned_editor(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.generate_manuscript_id() TO authenticated;
