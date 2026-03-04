-- =============================================
-- Supabase Setup SQL
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable RLS
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('study-materials', 'study-materials', true),
  ('attendance-photos', 'attendance-photos', false),
  ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies: Study Materials (public read)
CREATE POLICY "Public read study materials" ON storage.objects
  FOR SELECT USING (bucket_id = 'study-materials');

CREATE POLICY "Admin upload study materials" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'study-materials' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin delete study materials" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'study-materials' 
    AND auth.role() = 'authenticated'
  );

-- Storage Policies: Attendance Photos (authenticated only)
CREATE POLICY "Authenticated read attendance photos" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'attendance-photos' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated upload attendance photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'attendance-photos' 
    AND auth.role() = 'authenticated'
  );

-- Storage Policies: Certificates (public read)
CREATE POLICY "Public read certificates" ON storage.objects
  FOR SELECT USING (bucket_id = 'certificates');

CREATE POLICY "Admin upload certificates" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'certificates' 
    AND auth.role() = 'authenticated'
  );

-- Optional: User profiles table (syncs with MongoDB)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mongo_user_id TEXT,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'cadet')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
