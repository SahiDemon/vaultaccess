import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://qeyedottjtnszzeuvbjz.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFleWVkb3R0anRuc3p6ZXV2Ymp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NzQ4MDQsImV4cCI6MjA2MzU1MDgwNH0.Y-SFLH84R-Cmg9DO5vM4x46pq2Yg7-iVod8s6iPVM6I';

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export const supabase = supabaseClient;
export default supabaseClient; 