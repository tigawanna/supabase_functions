import { config } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.26.0";
import { logInfo } from "../loggers.ts";
// const SUPABASE_URL = "https://iwdfzvfqbtokqetmbmbp.supabase.co";
// const SUPABASE_KEY =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDU2NzAxMCwiZXhwIjoxOTQ2MTQzMDEwfQ._gr6kXGkQBi9BM9dx5vKaNKYj_DJN1xlkarprGpM_fU";

const SUPABASE_URL = config().SUPABASE_URL;
const SUPABASE_KEY = config().SUPABASE_KEY;

// logInfo("SUPABASE_URL", SUPABASE_URL);
// logInfo("SUPABASE_KEY", SUPABASE_KEY);


export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
