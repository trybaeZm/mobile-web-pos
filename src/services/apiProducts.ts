import { Product } from "@/types/product";
import { supabase } from "./SupabaseConfig";

export async function getAllProducts(businessId?: string): Promise<Product[] | null> {
    try {
        let query = supabase.from('products').select('*');

        if (businessId) {
            query = query.eq('business_id', businessId);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching products:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching products:", err);
        return null;
    }
}

export async function getProductById(id: string): Promise<Product | null> {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching product:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching product:", err);
        return null;
    }
}
