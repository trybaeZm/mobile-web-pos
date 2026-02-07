import { UsersType } from "@/types/Customers"
import { getUserById } from "./api/apiUser"
import { supabase } from "./SupabaseConfig"

export const checkuserexists = async (id: string | null | undefined) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check is user exists in db
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .single()
            if (data) {
                resolve(true)
            }
            if (error) {
                reject(false)
            }
        } catch (error) {
            reject(false)
        }
    })
}

export const SignUpwithGoogle = async () => {
    const url = `${process.env.NEXT_PUBLIC_GOOGLE_AUTH_REDIRECT}/auth/callback`;
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: url,
        },
    })

    if (error) console.error("Google Auth error:", error)
    return data
}

export const getUserByEmail = async (email: string): Promise<null | UsersType[]> => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email.toLowerCase())

        if (error) {
            console.error(error)
            return null
        }

        return data
    } catch (error) {
        console.error(error)
        return null
    }
}
