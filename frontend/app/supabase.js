import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://asvhruseebznfswjyxmx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdmhydXNlZWJ6bmZzd2p5eG14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5OTAxNTgsImV4cCI6MjA0MTU2NjE1OH0.kulmJJTp3qH-VPYUmNHbPYpG3b8zGY7OxjgP3dQkEpY"
);

export default supabase;
