require('dotenv').config({ path: 'C:\\D\\NCC Folder\\NCC-1-Maharashtra\\backend\\.env' });
const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SERVICE_ROLE_KEY);

async function run() {
  console.log("Since Supabase REST API doesn't allow raw DDL via createClient normally unless exposed via RPC...");
  // Let's create an RPC if not exist or fallback to node-postgres.
  
  const { Client } = require('pg');
  const uri = process.env.SUPABASE_URL.replace('https://', 'postgres://postgres:').replace('.supabase.co', '') + '.supabase.co:5432/postgres'; 
  console.log(uri); 
  // Wait, user might not have standard postgres uri.
}
run();
