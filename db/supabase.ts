import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL) {
  throw new Error("Missing SUPABASE_URL environment variable");
}

if (!SUPABASE_KEY) {
  throw new Error("Missing SUPABASE_ANON_KEY environment variable");
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
