import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://egeohfvpbdxxisnmppks.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZW9oZnZwYmR4eGlzbm1wcGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MzYzMDksImV4cCI6MjA3OTUxMjMwOX0.dtSgL0GIVU1XaQrqD6LRu9k5qHAMYZsumOrr11RKDnE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
