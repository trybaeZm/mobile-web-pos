import { AuthenticatedUser } from "@/types/auth/googleauth";
import { generateUserToken } from "@/app/actions";
import { getUserByEmail } from "../apiUsers";
import { UsersType } from "@/types/Customers";
import { supabase } from "../SupabaseConfig";

export const LoginAuth = async (loginData: any): Promise<null | any> => {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData), // 👈 Send raw data, not wrapped in { data }
        });

        if (!response) {
            throw new Error('Login failed');
        }

        const result = await response.json();

        if (response.status == 401) {
            return result
        }


        return result

    } catch (error: any) {
        console.error('Error:', error.message);
        return null
    }

}
interface AuthenticatedUserWithToken {
    Token: string;
    user: Partial<UsersType>;
}


export const getTokenForUser = async (userData: UsersType): Promise<string> => {
    // Generate a token using your existing function

    const responseToken = await fetch('/api/getToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData: userData })
    });

    if (!responseToken.ok) {
        const errorText = await responseToken.text();
        console.error("Failed to get token:", responseToken.status, errorText);
        throw new Error(`Failed to get token: ${responseToken.status}`);
    }

    const tokenData = await responseToken.json();

    return tokenData.token;
}

export const upsertUserData = async (Authresponse: AuthenticatedUser): Promise<AuthenticatedUserWithToken | null> => {
    const googleuserData = Authresponse.user_metadata
    let getToken;

    const getusers = await getUserByEmail(googleuserData.email || "");
    const doesuserexist = getusers && getusers.length > 0 ? getusers[0] : null;

    if (!doesuserexist) {

        const userData: Partial<UsersType> = {
            email: googleuserData.email || "",
            id: Authresponse.id,
            name: Authresponse.user_metadata.full_name || "",
            image_url: Authresponse.user_metadata.avatar_url || "",
            phone: Authresponse.phone || "",
            role: "business_owner",
        }

        try {
            const { data, error } = await supabase
                .from('users')
                .insert(userData)
                .select()
                .single()

            if (data) {
                try {
                    getToken = await generateUserToken(data);
                    return { user: data, Token: getToken }
                } catch (tokenErr) {
                    console.error("Error generating token for new user:", tokenErr);
                    return null;
                }
            }

            if (error) {
                console.error("Error upserting user data:", error)
                return null
            }

            return null

        } catch (error) {
            console.error("Exception upserting user data:", error)
            return null
        }


    } else {
        try {
            getToken = await generateUserToken(doesuserexist);
            return { Token: getToken, user: doesuserexist }
        } catch (error) {
            console.error("Error generating token for existing user:", error);
            return null;
        }
    }
}


export const SignUpAuth = async (Data: any): Promise<{
    data: any | null;
    Token: string | null;
    Status: string;
    message: string;
}> => {

    const hashedPassword = Data.password; //await bcrypt.hash(Data.password, 10);

    try {
        const { data, error } = await supabase.auth.signUp({
            email: Data.email,
            password: hashedPassword,
        });

        if (error) {
            console.error("Error signing up:", error.message);
            return {
                data: null,
                Token: null,
                Status: "error",
                message: error.message,
            };
        }

        if (data) {
            let checkuser;
            try {
                checkuser = await getUserByEmail(data.user?.email || "");
            } catch (getUserError) {
                console.error("Error in getUserByEmail:", getUserError);
                throw getUserError;
            }

            if (Array.isArray(checkuser) && checkuser.length > 0) {
                console.log("User already exists in database.");

                try {
                    const Token = await getTokenForUser(checkuser[0]);
                } catch (tokenError) {
                    console.error("Error in getTokenForUser (existing user):", tokenError);
                }

                return {
                    data: null,
                    Token: null,
                    Status: "error",
                    message: "User already exists.",
                };
            } else {
                console.log("User does not exist in database, creating new user.");

                let insertData;
                let insertError;
                try {
                    const result = await supabase
                        .from("users")
                        .insert([
                            {
                                name: Data.name,
                                email: Data.email,
                                password_hash: hashedPassword,
                                role: "business_owner",
                            },
                        ])
                        .select()
                        .single();
                    insertData = result.data;
                    insertError = result.error;
                } catch (supabaseInsertError) {
                    console.error("Error in supabase insert:", supabaseInsertError);
                    throw supabaseInsertError;
                }

                if (insertError) {
                    console.error("Insert error:", insertError.message);
                    return {
                        data: null,
                        Token: null,
                        Status: "error",
                        message: insertError.message,
                    };
                }

                let Token;
                try {
                    Token = await getTokenForUser(insertData);
                } catch (tokenError) {
                    console.error("Error in getTokenForUser (new user):", tokenError);
                    throw tokenError;
                }

                return {
                    data: insertData,
                    Token: Token || null,
                    Status: "success",
                    message: "User created successfully.",
                };
            }
        }

        return {
            data: null,
            Token: null,
            Status: "error",
            message: "Signup failed. Please try again.",
        };
    } catch (err: any) {
        console.error("Unexpected error signing up:", err);
        return {
            data: null,
            Token: null,
            Status: "error",
            message: err.message || "Unexpected error occurred.",
        };
    }

}


export const authenticateUser = async (): Promise<AuthenticatedUser | null> => {
    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser()

        if (error || !user) {
            return null
        }

        if (user) {
            return user as AuthenticatedUser
        }

        return null
    } catch (error) {
        console.error("Error authenticating user:", error)
        return null
    }


}


export const updateUserData = async (token: string) => {

}
