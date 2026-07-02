DROP POLICY IF EXISTS "Users manage own propostas" ON public.propostas;

CREATE POLICY "Authenticated can view all propostas"
  ON public.propostas FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users insert own propostas"
  ON public.propostas FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own propostas"
  ON public.propostas FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own propostas"
  ON public.propostas FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);