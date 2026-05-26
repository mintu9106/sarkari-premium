const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://glcqiynwytollsskpkcs.supabase.co';
const supabaseKey = 'sb_secret_8x6S-YzOhA6r8zE_Pgsxew_I7Mfb9hu';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  try {
    console.log("Querying 'jobs' table...");
    // Fetch total count and latest jobs
    const { data: jobs, error, count } = await supabase
      .from('jobs')
      .select('title, category, updated_at', { count: 'exact' })
      .order('updated_at', { ascending: false });

    if (error) {
      console.log("Error querying table:", error.message);
    } else {
      console.log(`Total jobs in database: ${count}`);
      console.log("\nLatest 25 jobs:");
      jobs.slice(0, 25).forEach((j, i) => {
        console.log(`${i+1}. [${j.category}] ${j.title} (Updated: ${j.updated_at})`);
      });
    }
  } catch (e) {
    console.error("Test failed:", e);
  }
}

test();
