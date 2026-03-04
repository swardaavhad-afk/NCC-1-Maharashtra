// =============================================
// Supabase Client Configuration
// =============================================
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Server-side client with service role (full access)
const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Client-side safe client (limited access via RLS)
const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ── Supabase Storage Helpers ──
const uploadFile = async (bucket, filePath, file, contentType) => {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, file, { contentType, upsert: true });
  if (error) throw error;
  return data;
};

const getPublicUrl = (bucket, filePath) => {
  if (!supabase) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
  return data.publicUrl;
};

const deleteFile = async (bucket, filePaths) => {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .remove(filePaths);
  if (error) throw error;
  return data;
};

// ── Supabase Auth Helpers ──
const createSupabaseUser = async (email, password, metadata = {}) => {
  if (!supabaseAdmin) throw new Error('Supabase not configured');
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: metadata
  });
  if (error) throw error;
  return data;
};

const signInWithEmail = async (email, password) => {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) throw error;
  return data;
};

module.exports = {
  supabase,
  supabaseAdmin,
  uploadFile,
  getPublicUrl,
  deleteFile,
  createSupabaseUser,
  signInWithEmail
};
