'use server'

import { generateToken } from "@/services/token";

export async function generateUserToken(userData: any) {
    if (!userData || !userData.id || !userData.email) {
        throw new Error("Invalid user data");
    }

    // Generate token (expires in 24 hours)
    return generateToken(userData, '24h');
}
