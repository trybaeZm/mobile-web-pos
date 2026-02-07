import { supabase } from '../SupabaseConfig'
import { BusinessType } from '@/types/businesses'

// custom functions
export const getBusinessByOwnerID = (id: string): Promise<null | BusinessType[]> => {
    const businessess: BusinessType[] = [];

    return new Promise(async (resolve, reject) => {
        console.log("Fetching business owner with ID:", id);
        try {
            const { data, error } = await supabase
                .from('business_owners')
                .select('businesses(*)')
                .eq('user_id', id)
                .eq('businesses.is_deleted', false) as { data: { businesses: BusinessType }[] | null, error: any }

            if (error) {
                console.error("Error fetching business owner:", error.message);
            }

            for (let i = 0; i < (data?.length || 0); i++) {
                if (data && data[i] && data[i].businesses) {
                    businessess.push(data[i].businesses);
                }
            }

        } catch (err) {
            console.error("Unexpected error fetching business owner:", err);
            reject(null);
        }

        try {
            const { data, error } = await supabase
                .from('teams')
                .select('businesses(*)')
                .eq('member', id)
                .eq('businesses.is_deleted', false) as { data: { businesses: BusinessType }[] | null, error: any }

            if (data) {
                // console.log("member business:", data)
                for (let i = 0; i < (data?.length || 0); i++) {
                    if (data && data[i] && data[i].businesses) {
                        businessess.push(data[i].businesses);
                    }
                }
            }

            if (error) {
                console.error("Error fetching business owner:", error.message);
            }

        } catch (error) {

        }

        resolve(businessess)
    })
}
