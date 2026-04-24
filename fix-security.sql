-- Enable Row Level Security (RLS) on all public tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cadets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.camp_cadets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;

-- Set search_path on the function to fix "Function Search Path Mutable"
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

-- Optional: If your backend uses the service_role key, it bypasses RLS, so this is safe.
-- If you access via the API using anon keys, you may need to add specific policies like:
-- CREATE POLICY "Allow public read" ON public.cadets FOR SELECT USING (true);
