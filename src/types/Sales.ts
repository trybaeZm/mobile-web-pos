export type Sale = {
    sale_id: number;
    id: string;
    customer_id?: number | null;
    user_id?: number | null;
    product_id: string;
    created_at: string
    amount: number;
    sale_date?: string | null;
};
