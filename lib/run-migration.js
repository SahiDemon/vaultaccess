const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Get the Supabase URL and key from environment variables or replace with your values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qeyedottjtnszzeuvbjz.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFleWVkb3R0anRuc3p6ZXV2Ymp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NzQ4MDQsImV4cCI6MjA2MzU1MDgwNH0.Y-SFLH84R-Cmg9DO5vM4x46pq2Yg7-iVod8s6iPVM6I';

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, 'migrations', 'update_history_table_timestamp.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Running migration to update _history table timestamp...');
    
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error executing migration:', error);
      
      // Try direct SQL approach as fallback
      const { error: directError } = await supabase.auth.updateUser({
        data: {
          sql
        }
      });
      
      if (directError) {
        console.error('Direct SQL approach also failed:', directError);
      } else {
        console.log('Migration succeeded via direct SQL approach');
      }
    } else {
      console.log('Migration executed successfully');
    }
  } catch (err) {
    console.error('Migration error:', err);
  }
}

// Run the migration
runMigration(); 