// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kombmceddsnwisymrlwn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvbWJtY2VkZHNud2lzeW1ybHduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MjE4MDIsImV4cCI6MjA4NDQ5NzgwMn0.Bzyf00VQG35L_N0h71TrmsWvI5gj1rn_gtf--E8sx50';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
