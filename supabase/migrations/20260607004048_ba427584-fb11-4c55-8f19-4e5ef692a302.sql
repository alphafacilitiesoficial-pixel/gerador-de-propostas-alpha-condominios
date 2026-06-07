
-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  role TEXT NOT NULL DEFAULT 'vendedor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Propostas table
CREATE SEQUENCE public.propostas_seq START 1;

CREATE TABLE public.propostas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_proposta TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  nome_condominio TEXT NOT NULL,
  endereco TEXT NOT NULL,
  unidades INTEGER NOT NULL,
  tipo TEXT NOT NULL,
  nome_contato TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT NOT NULL,
  incluiu_administracao BOOLEAN NOT NULL DEFAULT false,
  incluiu_sindico BOOLEAN NOT NULL DEFAULT false,
  valor_essencial NUMERIC,
  valor_completo NUMERIC,
  valor_premium TEXT,
  valor_sindico TEXT,
  status TEXT NOT NULL DEFAULT 'enviada',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.propostas TO authenticated;
GRANT ALL ON public.propostas TO service_role;
GRANT USAGE ON SEQUENCE public.propostas_seq TO authenticated, service_role;
ALTER TABLE public.propostas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own propostas" ON public.propostas FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE INDEX propostas_user_id_idx ON public.propostas(user_id);
CREATE INDEX propostas_created_at_idx ON public.propostas(created_at DESC);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nome, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)), 'vendedor');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to generate proposal number
CREATE OR REPLACE FUNCTION public.generate_proposta_numero()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  next_num INTEGER;
BEGIN
  next_num := nextval('public.propostas_seq');
  RETURN 'PROP-' || EXTRACT(YEAR FROM now())::TEXT || '-' || LPAD(next_num::TEXT, 3, '0');
END;
$$;

GRANT EXECUTE ON FUNCTION public.generate_proposta_numero() TO authenticated, service_role;
