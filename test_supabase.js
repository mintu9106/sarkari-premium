const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://glcqiynwytollsskpkcs.supabase.co';
const supabaseKey = 'sb_secret_8x6S-YzOhA6r8zE_Pgsxew_I7Mfb9hu';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    console.log("Checking if 'jobs' table exists...");
    const { data, error } = await supabase.from('jobs').select('*').limit(1);
    if (error) {
      console.log("Error querying table:", error.message);
      if (error.message.includes('does not exist')) {
        console.log("TABLE_DOES_NOT_EXIST");
      }
    } else {
      console.log("Table exists! Retrieved data:", data);
      console.log("TABLE_EXISTS");
    }
  } catch (e) {
    console.error("Test failed:", e);
  }
}

test();
