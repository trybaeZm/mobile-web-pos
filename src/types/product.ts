export type Product = {
    image: string;
    id: string;
    business_id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    stock: number;
    created_at?: string;
    quantity?: number; // Optional, often used in cart context
};

export type ProductInsert = {
    imageName?: string;
    business_id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    // Add other insert fields as necessary
    int_business_id?: number;
    partialPayment?: number;
};
