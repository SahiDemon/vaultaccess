const { createClient } = require('@supabase/supabase-js');

// Get the Supabase URL and key from environment variables or replace with your values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qeyedottjtnszzeuvbjz.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFleWVkb3R0anRuc3p6ZXV2Ymp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NzQ4MDQsImV4cCI6MjA2MzU1MDgwNH0.Y-SFLH84R-Cmg9DO5vM4x46pq2Yg7-iVod8s6iPVM6I';

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('Setting up database...');

  // Create the alerts table if it doesn't exist
  const { error: createError } = await supabase.rpc('create_alerts_table');
  
  if (createError) {
    console.error('Error creating alerts table:', createError);
    
    // Try direct SQL if RPC fails
    console.log('Trying direct SQL...');
    const { error: sqlError } = await supabase.from('_exec_sql').select(`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        message TEXT NOT NULL,
        date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        severity TEXT NOT NULL DEFAULT 'info'
      );
    `);
    
    if (sqlError) {
      console.error('Error with direct SQL:', sqlError);
    } else {
      console.log('Alerts table created successfully with direct SQL');
    }
  } else {
    console.log('Alerts table created successfully');
  }

  // Insert sample data
  const sampleAlerts = [
    { type: 'ACCESS_CONTROL', message: 'Fingerprint access disabled', severity: 'info', date: new Date().toISOString() },
    { type: 'ACCESS_CONTROL', message: 'RFID access disabled', severity: 'info', date: new Date().toISOString() },
    { type: 'ACCESS_CONTROL', message: 'Fingerprint access enabled', severity: 'info', date: new Date().toISOString() },
    { type: 'ACCESS_CONTROL', message: 'RFID access enabled', severity: 'info', date: new Date().toISOString() },
    { type: 'SYSTEM', message: 'System updated to version 2.1.0', severity: 'info', date: new Date().toISOString() },
  ];

  const { error: insertError } = await supabase.from('alerts').insert(sampleAlerts);
  
  if (insertError) {
    console.error('Error inserting sample alerts:', insertError);
  } else {
    console.log('Sample alerts inserted successfully');
  }

  console.log('Database setup complete');
}

// Run the setup function
setupDatabase()
  .catch(err => {
    console.error('Setup failed:', err);
  }); 