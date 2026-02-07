import { supabase } from '../SupabaseConfig';
import { getProductsAndServices } from "./products"
import { InventoryResponses } from '@/types/inventoryTypes';

export const getInventory = async (businessid: string | undefined | null): Promise<{ allInventory: InventoryResponses[] }> => {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log("running...")
            // const allProducts = await getAllProducts(businessid)
            const allProducts = await getProductsAndServices(businessid)
            const { data, error } = await supabase
                .from('stock_table')
                .select('*')
                .eq('business_id', businessid)

            if (data) {
                // console.log("Inventory retrieved successfully:", data);
                const combinedData = allProducts?.map((product) => {
                    const stock = data.find((stock) => stock.product_id === product.id)
                    return {
                        ...product,
                        product_id: product.id,
                        quantity: stock?.quantity || 0,
                        low_stock_threshold: stock?.low_stock_threshold || 0
                    }
                })

                // console.log(combinedData)
                resolve({ allInventory: combinedData as InventoryResponses[] })
            }
            if (error) {
                console.error("Error getting inventory:", error.message);
                reject(error);
            }

        } catch (error) {
            console.error("Unexpected error getting inventory:", error);
            reject(error);
        }
    })
}

export const getStockTable = async (businessid: string | undefined | null): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data, error } = await supabase
                .from('stock_table')
                .select('*')
                .eq('business_id', businessid)

            if (data) {
                // console.log("Inventory retrieved successfully:", data);
                resolve(data)
            }
            if (error) {
                console.error("Error getting inventory:", error.message);
                reject(error);
            }

        } catch (error) {
            console.error("Unexpected error getting inventory:", error);
            reject(error);
        }
    })
}

export const addNewInventory = async (inventoryData: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { data, error } = await supabase
                .from('stock_table')
                .insert(inventoryData)
                .select()
            if (data) {
                // console.log("Inventory added successfully:", data);
                resolve(data)
            }
            if (error) {
                console.error("Error adding inventory:", error.message);
                reject(error);
            }
        } catch (error) {
            console.error("Unexpected error adding inventory:", error);
            reject(error);
        }
    })
}
