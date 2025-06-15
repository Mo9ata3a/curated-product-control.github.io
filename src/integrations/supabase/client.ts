
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hpgpjnsmplqeatpmtqna.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwZ3BqbnNtcGxxZWF0cG10cW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMDI2NDUsImV4cCI6MjA2MTU3ODY0NX0.GxwlbicmO4ir0RIIqS2DZ1-pS7HY3c4WD_mEnZGMrTs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: sessionStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
