import { getCorsHeaders } from "@/services/api/header";
import { generateToken } from "@/services/token";

export async function OPTIONS(request: Request) {
    return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request),
    });
}

// Define a type for the user data payload

export async function POST(request: Request) {
    try {
        const { userData } = await request.json();

        if (!userData || !userData.id || !userData.email) {
            return new Response(
                JSON.stringify({ error: "Invalid user data" }),
                { status: 400, headers: getCorsHeaders(request) }
            );
        }

        // Generate token (expires in 24 hours)
        const token = generateToken(userData, '24h');

        return new Response(
            JSON.stringify({
                message: 'Token generated successfully',
                token, // lowercase key is more standard
            }),
            {
                status: 200,
                headers: {
                    ...getCorsHeaders(request),
                    "Content-Type": "application/json",
                },
            }
        );

    } catch (error) {
        console.error("Error generating token:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            {
                status: 500,
                headers: getCorsHeaders(request),
            }
        );
    }
}
