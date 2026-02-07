import { Product, ProductInsert } from "@/types/product"
import { supabase } from "../SupabaseConfig"
import { Sale } from "@/types/Sales";
import { Customers } from "@/types/Customers";
import { OrderData } from "@/types/Orders";
// import { ProductAi, ProductAIResponse } from "@/components/ProductsAndServices/components/AIUploadModal";
// import { BusinessType } from "@/types/businesses";
import { BusinessType } from "@/types/businesses";
// import { ProductsAndServices } from "@/components/ProductsAndServices/ProductsAndServices";
import { InventoryResponses } from "@/types/inventoryTypes";

// Mocking missing types
export type ProductAi = any;
export type ProductAIResponse = any;

// Define AmountDistEntry type
export type AmountDistEntry = {
    product: Product;
    amountMade: number;
};

// Define the overall data structure
export type SalesAnalyticsData = {
    products: ProductWithSales[] | null;
    revenueData: RevenueData[] | null;
    ordersLastSevenDays: OrderData[] | null;
};

export type RevenueData = {
    location: string;
    totalSales: number
}

export interface ImagePreview {
    name: string;
    url: string;
    file: File;
}

export type ProductWithSales = Product & { sales: number }

export const getDataforsalseAnalytics = async (
    business_id: any
): Promise<SalesAnalyticsData | null> => {
    try {
        const products = await getProductsAndServices(business_id);
        const raworders = await getOrdersByBusinessId(business_id);
        const orders = raworders?.filter((order: OrderData) => order.order_payment_status === "completed");

        if (!orders) return null;

        // Get today's date
        const today = new Date();

        // Date 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        // Filter orders whose created_at is >= sevenDaysAgo
        const recentOrders = orders?.filter((order: OrderData) => {
            return new Date(order.created_at) >= sevenDaysAgo;
        }) ?? [];

        // Map: { "Kitwe": totalSales }
        const locationMap: Record<string, number> = {};

        for (const order of recentOrders) {
            const location = order.customers?.location ?? "Anonymous";
            const amount = order.total_amount ?? 0;

            if (!locationMap[location]) {
                locationMap[location] = 0;
            }

            locationMap[location] += amount;
        }

        const result = Object.entries(locationMap).map(([location, totalSales]) => ({
            location,
            totalSales,

        }));

        return {
            products,
            revenueData: result,
            ordersLastSevenDays: recentOrders
        };

    } catch (err) {
        console.error("Error in getDataforsalseAnalytics:", err);
        return null;
    }
};

export const getProductsAndServices = (business_id: string | null | undefined): Promise<ProductWithSales[] | null> => {
    return new Promise(async (resolve, reject) => {
        const products: Product[] = []
        const sales: OrderData[] = []

        const combinedData: ProductWithSales[] = [] // Typed array

        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('business_id', business_id)

            if (data) {
                products.push(...data)
            }

            if (error) {
                reject(error)
            }

        } catch (error) {
            reject(error)
        }


        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('business_id', business_id)

            if (data) {
                sales.push(...data)
            }

            if (error) {
                reject(error)
            }

        } catch (error) {
            reject(error)
        }


        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            let quantitySold = 0;

            for (let j = 0; j < sales.length; j++) {
                const saleProducts = sales[j].products;

                if (saleProducts) {
                    if (saleProducts.length <= 0) continue;
                    for (let k = 0; k < saleProducts.length; k++) {
                        const saleProduct = saleProducts[k];
                        if (saleProduct.product_id == product.id) {
                            quantitySold += saleProduct.quantity;
                        }
                    }
                } else {
                    continue;
                }
            }

            combinedData.push({ ...product, sales: quantitySold })
        }

        resolve(combinedData)
    })
}

export const updateProductAndService = async (
    product: Partial<ProductInsert>,
    id: string,
    imageData?: ImagePreview | null
): Promise<any> => {

    return new Promise(async (resolve, reject) => {
        try {
            // Update product data
            if (product) {
                const { data: updatedData, error: updateError } = await supabase
                    .from("products")
                    .update(product)
                    .eq("id", id);

                if (updateError) {
                    console.error("Update failed:", updateError);
                    reject(updateError);
                }

                console.log("Updated record:", updatedData);
            }

            // Upload image if provided
            if (imageData) {

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('uploaded-files')
                    .upload(
                        `products/${id}/${imageData.name}`,
                        imageData.file
                    )

                if (uploadError) {
                    console.error("Image upload failed:", uploadError);
                    reject(uploadError);
                }

                console.log("Image uploaded:", uploadData);
            }

            resolve("success");
        } catch (error) {
            console.error("Error updating product and image:", error);
            resolve(error);
        }
    })
};


export const createMulitipleProductsandservices = async (products: ProductAi[], businessData: BusinessType) => {
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const staticData = {
            name: product.name ?? "",
            imageName: product.imageUrl,
            price: product.price ?? 0,
            category: product.category ?? "",
            description: product.description || "",
            business_id: businessData?.id || "",
            int_business_id: businessData?.business_id || 0,
            partialPayment: (product.price ?? 0) * 0.3, // default to 30% of the price if not provided
        };

        const imagePrev = {
            name: product.imageUrl,
            file: product.file,
            url: product.imageUrl
        }
        try {
            const createdProduct = await createProductAndService(staticData, imagePrev);

            if (createdProduct) {
                // console.log("")
            } else {
                return false
            }
        } catch (err) {
            console.error(err);
            return false
        }
    }


    return true

}

export const createProductAndService = async (product: ProductInsert, imageData: ImagePreview | null): Promise<Product | null> => {

    return new Promise(async (resolve, reject) => {
        console.log('adding product')
        try {
            const { data: productData, error } = await supabase
                .from('products')
                .insert(product)
                .select()
                .single();

            if (error) {
                console.error("Error creating product:", error.message);
                reject(error);
            }

            if (productData) {
                try {
                    if (imageData) {
                        // If imageData is provided, insert images into the 'product_images' table
                        const { data, error } = await supabase.storage
                            .from('uploaded-files')
                            .upload(
                                `products/${productData.id}/${imageData.name}`,
                                imageData.file
                            )

                        if (data) {
                            console.log(data)
                        }
                        if (error) {
                            console.log(error)
                            reject(error);
                        }
                    }
                    resolve(productData);
                } catch (error) {
                    console.error("Error inserting product images:", error);
                    reject(error);
                }
            }

        } catch (err) {
            console.error("Unexpected error creating product:", err);
            reject(err);
        }
    })
}

export const getProductImages = async (
    productId: string,
    fileName: string
): Promise<string | null> => {
    try {
        const filePath = `products/${productId}/${fileName}`;

        const { data } = supabase.storage
            .from("uploaded-files")
            .getPublicUrl(filePath);

        if (!data) {
            console.error("Error fetching product images:");
            return null;
        }
        return data.publicUrl ?? null;

    } catch (error) {
        console.error("Unexpected error fetching product images:", error);
        return null;
    }
};



export const getOrderProductsImages = async (orderId: string, productId: string) => {
    try {
        console.log(orderId, productId)
        const folderPath = `orders/${orderId}/products/${productId}`;

        // List all files in the product folder
        const { data: files, error: listError } = await supabase.storage
            .from("uploaded-files")
            .list(folderPath);

        if (listError) {
            console.error("Error listing product images:", listError);
            return [];
        }

        // Return early if no files exist
        if (!files || files.length === 0) {
            return [];
        }

        // Generate public URLs
        const urls = files
            .filter(file => !file.name.startsWith('.')) // Filter out hidden files or placeholders
            .map(file => {
                const { data } = supabase.storage
                    .from("uploaded-files")
                    .getPublicUrl(`${folderPath}/${file.name}`);

                return data?.publicUrl;
            })
            .filter((url): url is string => Boolean(url)); // Ensure only valid strings are returned

        return urls;

    } catch (error) {
        console.error("Unexpected error fetching product images:", error);
        return [];
    }
};
