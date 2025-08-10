// Simple test to verify Supabase connection
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://isqquleqerenslvpzubf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzcXF1bGVxZXJlbnNsdnB6dWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MTIzODgsImV4cCI6MjA2NzQ4ODM4OH0.W19goxpqSbE2t0Hk8W-fQeEMJnKM4oQkCl6sthX9mso";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Test connection
async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('players').select('count');
    if (error) {
      console.error('Supabase error:', error);
    } else {
      console.log('Supabase connection successful:', data);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

testConnection();
