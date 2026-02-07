import { createClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// @ts-ignore
export const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
    try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.error("Supabase connection failed:", error.message);
        } else {
            console.log("Supabase connection successful!");
        }
    } catch (err) {
        console.error("Error connecting to Supabase:", err);
    }
})();
