import { Product } from "./product";

export type inventoryData = {
    id: string;
    product_id: string;
    quantity: number;
    business_id: string;
    low_stock_threshold: number;
    last_restocked: string;
};

export type stock_table = {
    id: string;
    product_id: string;
    quantity: number;
    business_id: string;
    low_stock_threshold: number;
    last_restocked: string;
};

export interface InventoryResponse {
    products: Product | null; // Join result
    quantity: number;
}

export interface InventoryResponses extends Product {
    product_id: string;
    quantity: number;
    low_stock_threshold: number;
    sales: number;
}
