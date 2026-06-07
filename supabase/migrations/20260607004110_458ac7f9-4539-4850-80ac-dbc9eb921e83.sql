
-- Make generate_proposta_numero secure and restricted
CREATE OR REPLACE FUNCTION public.generate_proposta_numero()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
BEGIN
  next_num := nextval('public.propostas_seq');
  RETURN 'PROP-' || EXTRACT(YEAR FROM now())::TEXT || '-' || LPAD(next_num::TEXT, 3, '0');
END;
$$;

REVOKE EXECUTE ON FUNCTION public.generate_proposta_numero() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.generate_proposta_numero() TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
