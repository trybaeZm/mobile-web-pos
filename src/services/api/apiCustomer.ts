import { supabase } from '../SupabaseConfig';

interface Customer {
    id?: string;
    business_id?: string | null;
    name: string;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
    gender?: 'male' | 'female' | null;
    customer_type?: 'new' | 'returning' | null;
    created_at?: string;
}

// Get all customers
export async function getCustomers(): Promise<Customer[] | null> {
    try {
        const { data, error } = await supabase.from('customers').select('*');

        if (error) {
            console.error("Error fetching customers:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching customers:", err);
        return null;
    }
}

// Get a specific customer by ID
export async function getCustomerById(id: string): Promise<Customer | null> {
    try {
        const { data, error } = await supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching customer:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching customer:", err);
        return null;
    }
}

// Create a new customer
export async function createCustomer(newData: Customer): Promise<Customer | null> {
    try {
        const { data, error } = await supabase
            .from('customers')
            .insert(newData)
            .select()
            .single();

        if (error) {
            console.error("Error creating customer:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error creating customer:", err);
        return null;
    }
}

// Update a customer by ID
export async function updateCustomer(id: string, updatedData: Partial<Customer>): Promise<Customer | null> {
    try {
        const { data, error } = await supabase
            .from('customers')
            .update(updatedData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error updating customer:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error updating customer:", err);
        return null;
    }
}

// Delete a customer by ID
export async function deleteCustomer(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('customers')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting customer:", error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error("Unexpected error deleting customer:", err);
        return false;
    }
}
