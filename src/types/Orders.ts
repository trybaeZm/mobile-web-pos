import { Customers } from "./Customers";

export type OrderData = {
    id: string;
    order_id: number;
    business_id: string;
    customer_id: string;
    order_status: string; // extend with more statuses if needed
    total_amount: number;
    created_at: string; // ISO date string
    product_id: string;
    partialAmountTotal: number;
    sammarized_notes: string;
    transaction_id: string;
    orderToken: string;
    delivery_location: string
    order_payment_status: string;
    customers: Customers;
    products: {
        name: string;
        quantity: number,
        product_id: string,
        specialInstructions: string,
        description: string,
        price: number
    }[]
};
