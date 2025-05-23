const { createClient } = require('@supabase/supabase-js');

// Get the Supabase URL and key from environment variables or replace with your values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qeyedottjtnszzeuvbjz.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFleWVkb3R0anRuc3p6ZXV2Ymp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NzQ4MDQsImV4cCI6MjA2MzU1MDgwNH0.Y-SFLH84R-Cmg9DO5vM4x46pq2Yg7-iVod8s6iPVM6I';

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Generate a date X hours ago
function hoursAgo(hours) {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

async function seedAlerts() {
  try {
    console.log('Adding sample alerts data...');

    // Sample alerts with realistic timestamps
    const sampleAlerts = [
      { type: 'ACCESS_CONTROL', message: 'Fingerprint access disabled', severity: 'info', date: hoursAgo(6) },
      { type: 'ACCESS_CONTROL', message: 'Fingerprint access disabled', severity: 'info', date: hoursAgo(6) },
      { type: 'ACCESS_CONTROL', message: 'RFID access disabled', severity: 'info', date: hoursAgo(6) },
      { type: 'ACCESS_CONTROL', message: 'Fingerprint access enabled', severity: 'info', date: hoursAgo(6) },
      { type: 'ACCESS_CONTROL', message: 'RFID access enabled', severity: 'info', date: hoursAgo(6) },
      { type: 'ACCESS_CONTROL', message: 'RFID access enabled', severity: 'info', date: hoursAgo(7) },
      { type: 'ACCESS_CONTROL', message: 'RFID access disabled', severity: 'info', date: hoursAgo(8) },
      { type: 'ACCESS_CONTROL', message: 'Fingerprint access enabled', severity: 'info', date: hoursAgo(9) },
      { type: 'ACCESS_CONTROL', message: 'Fingerprint access disabled', severity: 'info', date: hoursAgo(10) },
      { type: 'FACE_RECOGNITION', message: 'Reference face updated', severity: 'info', date: hoursAgo(11) },
      { type: 'SYSTEM', message: 'Multiple failed access attempts detected', severity: 'warning', date: hoursAgo(12) },
      { type: 'SYSTEM', message: 'System updated to version 2.1.0', severity: 'info', date: hoursAgo(24) },
      { type: 'SYSTEM', message: 'Database backup completed', severity: 'info', date: hoursAgo(36) },
      { type: 'SECURITY', message: 'New user registered', severity: 'info', date: hoursAgo(48) },
      { type: 'SECURITY', message: 'Administrator login from new location', severity: 'warning', date: hoursAgo(72) },
    ];

    // Insert the sample alerts
    const { error } = await supabase
      .from('alerts')
      .insert(sampleAlerts);
    
    if (error) {
      console.error('Error inserting sample alerts:', error);
    } else {
      console.log('Sample alerts inserted successfully');
    }
  } catch (err) {
    console.error('Failed to seed alerts:', err);
  }
}

// Run the seed function
seedAlerts(); 