
CREATE OR REPLACE FUNCTION public.generate_proposta_numero()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
BEGIN
  next_num := nextval('public.propostas_seq');
  RETURN 'PROP-' || EXTRACT(YEAR FROM now())::TEXT || '-' || LPAD(next_num::TEXT, 3, '0');
END;
$$;
GRANT EXECUTE ON FUNCTION public.generate_proposta_numero() TO authenticated, service_role;
