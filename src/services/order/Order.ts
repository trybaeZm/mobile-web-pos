import { createCustomer, getCustomersForBusiness, updateCustomer } from "../apiCustomers";
import { getOrdersByBusinessId, createOrder } from "../api/apiOrder"; // using api/apiOrder as reference
import { supabase } from "../SupabaseConfig";
import { UsersType } from "@/types/Customers";

interface CartItem {
    id: string;
    product_id: string;
    name: string;
    price: number;
    // image: string;
    quantity: number;
    description: string;
    subtotal: number;
    business_id: string;
    specialInstructions?: string;
}

export const makeOrderByMainUser = async (Payload: CartItem[], user?: Partial<UsersType>, business_id?: string) => {
    const userid = user ? user.id : "24434"
    const businessid = business_id
    let customer
    const totalAmount = Payload.reduce((acc, obj) => acc + obj.price * obj.quantity, 0);

    try {
        const customers = await getCustomersForBusiness(businessid)

        if (user) {
            customer = customers?.find(e => e.email === user.email || e.phone === user.phone)
            const customerId = customer?.id

            if (!customer) {
                const newUser = {
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    location: user.location,
                    // gender: user.gender,
                    business_id: businessid,
                }
                // create the user 
                const createduser = await createCustomer(newUser)
                if (createduser) {
                    customer = createduser
                }

            } else {
                // update the user 
                if (customerId) {
                    const data = await updateCustomer(Number(customer.customer_id), user as any)
                    customer = data
                }
            }
        }


        // create order 
        if (customer) {
            const newOrder = {
                business_id: businessid,
                customer_id: customer.id,
                order_status: "pending",
                total_amount: totalAmount,
                // product_id: Payload,
                products: Payload.map(item => ({
                    product_id: item.product_id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    description: item.description,
                    specialInstructions: item.specialInstructions || "" // Ensure it's not undefined
                })),
                order_payment_status: "completed"
            }
            const orderCreateResponse = await createOrder(newOrder);

            if (orderCreateResponse) {
                console.log("Order created successfully : ", orderCreateResponse);
                return orderCreateResponse
            }
        } else {
            const newOrder = {
                business_id: businessid,
                // customer_id: customer.id,
                order_status: "pending",
                total_amount: totalAmount,
                // product_id: Payload,
                products: Payload.map(item => ({
                    product_id: item.product_id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    description: item.description,
                    specialInstructions: item.specialInstructions || "" // Ensure it's not undefined
                })),
                order_payment_status: "completed"
            }
            const orderCreateResponse = await createOrder(newOrder);

            if (orderCreateResponse) {
                console.log("Order created successfully : ", orderCreateResponse);
                return orderCreateResponse
            }
        }


    } catch (err) {
        console.log(err)
        return false
    }

}
