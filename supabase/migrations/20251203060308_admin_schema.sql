-- threads
CREATE POLICY "Authenticated users can view all threads." ON public.threads
  FOR SELECT USING (auth.role() = 'authenticated');
-- comments
CREATE POLICY "Authenticated users can view all comments." ON public.comments
  FOR SELECT USING (auth.role() = 'authenticated');
