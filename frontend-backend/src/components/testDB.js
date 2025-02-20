const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables (adjust the path if needed)
dotenv.config({ path: '../../../.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and anon key must be set in your environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testQuery() {
  const { data, error } = await supabase.from('patients').select();

  if (error) {
    console.error('Error running query:', error);
  } else {
    console.log('Query result:', data);
  }
}

testQuery().then(() => process.exit());
