import { supabase } from './SupabaseConfig';
import { Customers, UsersType } from '@/types/Customers';
import { OrderData } from '@/types/Orders';
// import { Sale } from '@/types/Sales';


function isWithinLast7Days(dateValue: Date | string | number): boolean {
    const inputDate = new Date(dateValue);
    const now = new Date();

    // 7 days ago from now
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    return inputDate >= sevenDaysAgo && inputDate <= now;
}

export async function getCustomers() {
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

export async function updateCustomer(customerId: number, updatedData: Customers): Promise<Customers | null> {
    try {
        const { data, error } = await supabase
            .from('customers')
            .update(updatedData)
            .eq('customer_id', customerId);

        if (error) {
            console.error("Error updating customer:", error.message);
            return null;
        }

        if (data === null) {
            return null;
        }

        console.log("Customer updated successfully:", data);
        return data as Customers;
    } catch (err) {
        console.error("Unexpected error updating customer:", err);
        return null;
    }
}

// users should not be able to delete customers
export async function deleteCustomer(customerId: string): Promise<Customers | null> {
    try {
        // console.log('deleting data')
        // this line is working just fine i think lololool...
        const { data, error } = await supabase
            .from('customers')
            .delete()
            .eq('id', `${customerId}`);

        // error handling
        if (error) {
            console.error("Error deleting customer:", error.message);
            return null;
        }

        // if success but table returns empty array
        if (data === null) {
            return null;
        }

        console.log("Customer deleted successfully:", data);
        // returns array if data has a value
        return data as Customers;
    } catch (err) {
        console.error("Unexpected error deleting customer:", err);
        return null;
    }
}


export const getCustomersForBusiness = async (business_id: any): Promise<Customers[] | null> => {
    return new Promise(async (resolve, reject) => {
        console.log('getting user  data...')
        try {
            // console.log('deleting data')
            // this line is working just fine i think lololool...
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .eq('business_id', business_id)
            // error handling
            if (error) {
                console.error("Error getting customer:", error.message);
                reject(null)
                return null;
            }
            // if success but table returns empty array
            if (data === null) {
                return null;
            }
            //    console.log("customers retrieved successfully: ", data.length);
            // returns array if data has a value
            resolve(data);
        } catch (err) {
            console.error("Unexpected error retrieving customer:", err);
            reject(null)
            return null;
        }

    })
}


export const getCuststomerSales = async (id: any): Promise<any | null> => {
    const customers: any = await getCustomersForBusiness(id)
    const customerPriceArray: any = []
    let amountInLastSevenDays = 0
    let totalReturnRatio = 0

    const customerLocationRatio: any = []
    const usiqueLocation = Array.from(new Set(customers.map((e: Customers) => e.location)));

    for (let i = 0; i < usiqueLocation.length; i++) {
        const number = customers.filter((e: Customers) => e.location == usiqueLocation[i]).length | 0
        customerLocationRatio.push({ location: usiqueLocation[i], number: number })
    }


    function getRepeatingElements(inputArray: any) {
        const seen = new Set();
        const repeats = new Set(); // To ensure no duplicates in result

        for (const item of inputArray) {
            if (seen.has(item)) {
                repeats.add(item);
            } else {
                seen.add(item);
            }
        }

        // Convert the Set to an array if needed
        return Array.from(repeats);
    }

    const commonAreas = getRepeatingElements(customers.map((e: Customers) => e.location))
    const AreatoCustomers: { location: any; number: number }[] = []
    // number of male and female
    const male = customers?.map((e: Customers) => e.gender == 'male').length | 0
    const female = customers?.map((e: Customers) => e.gender == 'male').length | 0


    // this is for the users
    let newCstomer = 0
    let repeatCustomer = 0


    return new Promise(async (resolve, reject) => {

        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
            // error handling
            if (error) {
                // console.error("Error getting business:", error.message);
                reject(null)
            }

            // if success but table returns empty array
            if (data === null) {
                reject(null)
            }

            // console.log("Customer retrieved successfully:", data);
            // returns array if data has a value
            for (let i = 0; i < customers.length; i++) {
                const userid = customers[i].id

                // this filters the sales based on user id
                const filtererdata = data?.filter(e => e.customer_id == userid && e.order_payment_status == "completed") || []
                const totalAmount = filtererdata?.reduce((acc, curr) => acc + curr.total_amount, 0)

                // Get the current date
                const now = new Date();
                // 30 days ago
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(now.getDate() - 30);

                const orderByThisUser = filtererdata.length > 0; // Has purchased

                if (orderByThisUser) {
                    // Check if account is new (created in last 30 days)
                    const accountCreated = new Date(customers[i].created_at);

                    if (accountCreated >= thirtyDaysAgo) {
                        newCstomer++;
                    } else {
                        // Active purchaser but account > 30 days old = Repeat/Returning
                        repeatCustomer++;
                    }
                }


                customerPriceArray.push({ name: customers[i].name, id: customers[i].id, amount: totalAmount })
                // console.log('getting sales for user: ', userid)               
            }



            const CustomerId = customers.map((e: Customers) => e.id)
            // console.log('Customer Ids: ', CustomerId)
            const usiqueCustomerId = Array.from(new Set(CustomerId));
            const userCount = []

            for (let i = 0; i < usiqueCustomerId.length; i++) {
                let count
                const userId = usiqueCustomerId[i]
                count = data?.filter((e: OrderData) => e.customer_id == userId).length || 0

                if (count > 1) {
                    userCount.push({ id: userId, count: count })
                }

            }

            totalReturnRatio = userCount.length / usiqueCustomerId.length * 100

            for (let i = 0; i < (data?.length ?? 0); i++) {
                if (isWithinLast7Days(data![i].created_at)) {
                    amountInLastSevenDays += data![i].total_amount;
                }
            }

            console.log('Amount made in the last 7 days: ', amountInLastSevenDays)





            for (let i = 0; i < commonAreas.length; i++) {

                const number = customers.map((e: Customers) => e.location == commonAreas[i]).length | 0

                AreatoCustomers.push({ location: commonAreas[i], number: number })
            }







        }
        catch (err) {
            console.error("Unexpected error getting business:", err);
            reject(null)
        }

        // console.log(customerPriceArray)   
        resolve({
            customers: customers,
            totalReturnRatio: totalReturnRatio,
            amountInLastSevenDays: amountInLastSevenDays,
            customer: customerPriceArray,
            location: AreatoCustomers,
            gender: { male: male, female: female },
            customerNumber: { new: newCstomer, repeat: repeatCustomer },
            customerLocationRatio: customerLocationRatio

        })
    })

}


export const genderRatioData = async (business_id: string | null): Promise<null | any> => {
    return new Promise(async (resolve, reject) => {
        const customers = await getCustomersForBusiness(business_id)
        const Sales: OrderData[] | null = []

        try {
            const { data, error } = await supabase
                .from('orders')
                .select()

            if (data) {
                Sales.push(...data)
            }

            if (error) {
                console.log(error)
                reject(null)
            }
        } catch (err) {
            console.log(err)
            reject(null)
        }

        const maleCustomers = (customers ?? []).filter((e) => e.gender === 'male')
        const femaleCustomers = (customers ?? []).filter((e) => e.gender === 'female')

        const getTotalRevenue = (customer: Customers[]) => {
            const CollectedSales = []
            for (let i = 0; i < customer.length; i++) {
                for (let j = 0; j < Sales.length; j++) {
                    if (String(Sales[j].customer_id) == String(customer[i].id)) {
                        CollectedSales.push(...Array(Sales[j]))
                    }
                }
            }

            return CollectedSales
        }

        const MaleSales = getTotalRevenue(maleCustomers)
        const FeMaleSales = getTotalRevenue(femaleCustomers)

        // Revenue
        const TotalRevenueFemal: number = FeMaleSales.reduce((prev, curr) => prev + curr.total_amount, 0)
        const TotalRevenueMale: number = MaleSales.reduce((prev, curr) => prev + curr.total_amount, 0)
        const TotalRevenue: number = TotalRevenueFemal + TotalRevenueMale

        resolve({
            Revenue: {
                Total: TotalRevenue, male: TotalRevenueMale, female: TotalRevenueFemal
            },
            NumberOfSales: {
                male: MaleSales.length, female: FeMaleSales.length
            },
            CustomerRatio: {
                male: ((maleCustomers.length / ((customers?.length ?? 0) || 1)) * 100).toFixed(2), female: ((femaleCustomers.length / ((customers?.length ?? 0) || 1)) * 100).toFixed(2)
            }
        })
    })
}

export const getCustomersById = async (userid?: string) => {
    try {
        const { data, error } = await supabase
            .from("customers")
            .select("*")
            .eq("id", userid)
            .single()

        if (data) {
            return data
        }

        if (error) {
            return false
        }
    } catch (error) {
        return false
    }
}

export const createNormalUser = async (user: Partial<Customers>): Promise<Customers | null> => {
    try {
        const { data, error } = await supabase
            .from("customers")
            .insert(user)
            .select("*")
            .single()

        if (data) {
            console.log("user created successfully")
            return data
        }
        if (error) {
            return null
        }
    } catch (error) {
        console.log("failed when creating a customer", error)
        return null
    }

    return null
}


export const createCustomer = async (user?: Partial<UsersType>) => {
    try {
        const { data, error } = await supabase
            .from("customers")
            .insert(user)
            .select("*")
            .single()

        if (data) {
            console.log("user created successfully")
            return data
        }
        if (error) {
            return false
        }
    } catch (error) {
        console.log("failed when creating a customer", error)
        return false
    }
}

export const getCustomerbyPhoneandBusiness = async (customerId: string, businessId: string) => {
    try {
        const { data, error } = await supabase
            .from("customers")
            .select("*")
            .eq("phone", customerId)
            .eq("business_id", businessId)
            .single()

        if (data) {
            return data
        }

        if (error) {
            return false
        }
    } catch (error) {
        return false
    }
}
