import { OrderData } from '@/types/Orders';
import { supabase } from '../SupabaseConfig';

interface Order {
    id?: string;
    order_id?: number;
    business_id?: string;
    customer_id?: string;
    total_amount: number;
    order_status?: string;
    created_at?: string;
    customers?: {
        name?: string;
    };
}

// Get all orderss
export async function getOrders(): Promise<Order[] | null> {
    try {
        const { data, error } = await supabase.from('orders').select('*');

        if (error) {
            console.error("Error fetching orders:", error.message);
            return null;
        }

        // Map customers array to single object if present
        const mappedData = data?.map((order: any) => ({
            ...order,
            customers: order.customers && Array.isArray(order.customers) ? order.customers[0] : order.customers
        })) ?? null;

        return mappedData;

    } catch (err) {
        console.error("Unexpected error fetching orders:", err);
        return null;
    }
}

// Get a specific order by ID
export async function getOrderById(id: string): Promise<Order | null> {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching order:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error fetching order:", err);
        return null;
    }
}

// Create a new order
export async function createOrder(newData: Partial<Order>): Promise<Order | null> {
    try {
        const { data, error } = await supabase
            .from('orders')
            .insert(newData)
            .select()
            .single();

        if (error) {
            console.error("Error creating order:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error creating order:", err);
        return null;
    }
}

// Update an order by ID
export async function updateOrder(id: string, updatedData: Partial<Order>): Promise<Order | null> {
    try {
        const { data, error } = await supabase
            .from('orders')
            .update(updatedData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error("Error updating order:", error.message);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Unexpected error updating order:", err);
        return null;
    }
}

// Delete an order by ID
export async function deleteOrder(id: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting order:", error.message);
            return false;
        }

        return true;
    } catch (err) {
        console.error("Unexpected error deleting order:", err);
        return false;
    }
}


export async function getOrdersByBusinessId(
    business_id: string | null | undefined
): Promise<OrderData[] | null> {
    try {
        const { data, error } = await supabase
            .from("orders")
            .select("*, customers(*)")
            .eq("business_id", business_id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching orders:", error.message);
            return null;
        }

        return data as OrderData[];
    } catch (err) {
        console.error("Unexpected error fetching orders:", err);
        return null;
    }
}


export const getOrderImages = async (orderId: string): Promise<string[] | null> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data, error } = await supabase.storage
                .from('uploaded-files')
                .list(`orders/${orderId}`, {
                    limit: 100,
                    offset: 0,
                    sortBy: { column: 'name', order: 'asc' }
                });

            if (data) {
                resolve(data.map(file => `https://gaicgetnnwptxbqooywd.supabase.co/storage/v1/object/public/uploaded-files/orders/${orderId}/${file.name}`));
            }
        } catch (error) {
            console.error("Error fetching order images:", error);
            reject(null);
        }
    })
}

export const marckSettled = async (orderId: string): Promise<any> => {
    new Promise(async (resolve, reject) => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .update({ order_status: 'completed' })
                .eq('id', orderId);

            // Handle the response
            if (error) {
                console.error("Error updating order status:", error.message);
                reject(error);
            }

            if (data) {
                console.log("Order status updated successfully:", data);
                // Optionally, you can return the updated data
                resolve(data);
            }
        } catch (err) {
            console.error("Unexpected error updating order status:", err);
            reject(err);
        }
    })

}


const paymentUrl = "https://paymentbackend.inxource.com/api/payment";
// const paymentUrl = "http://localhost:8080/api/payment";

// Define a proper response type if you know the structure
interface PaymentStatusResponse {
    status: string;
    message?: string;
    data?: any;
}

export const updatePaymentStatus = async (
    paymentId: string,
    token: string
): Promise<PaymentStatusResponse> => {
    console.log(paymentId, token);
    try {
        const response = await fetch(`${paymentUrl}/checkPayment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentId, token }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: PaymentStatusResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Error updating payment status:", error);
        throw error;
    }
};
