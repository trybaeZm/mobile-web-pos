import { getUserById } from "@/services/api/apiUser";
import { decodeToken, verifyToken } from "@/services/token";
import { allowedOrigins } from "@/utils/routesfunc";

// ✅ Dynamic CORS header generator
function getCorsHeaders(request: Request): Record<string, string> {
    const origin = request.headers.get('origin') || '';
    const isAllowed = allowedOrigins.includes(origin);

    const headers: Record<string, string> = {
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
    };

    if (isAllowed) {
        headers['Access-Control-Allow-Origin'] = origin;
    }

    return headers;
}

export async function OPTIONS(request: Request) {
    return new Response(null, {
        status: 204,
        headers: getCorsHeaders(request),
    });
}

export async function POST(request: Request) {
    const headers = getCorsHeaders(request);

    try {
        const { token } = await request.json();
        const gottentoken = verifyToken(token);

        const decodedToken = decodeToken(token);

        // Safety check if decode failed
        if (!decodedToken || !decodedToken.id) {
            return new Response(JSON.stringify({ token: "error somewhere" }), {
                status: 401,
                headers,
            });
        }

        const collectedUserData = await getUserById(decodedToken?.id)

        // console.log(collectedUserData, "the token: ", decodedToken)
        if (collectedUserData) {
            return new Response(JSON.stringify({ token: gottentoken, user: collectedUserData }), {
                status: 200,
                headers,
            })
        }
        else {
            return new Response(JSON.stringify({ token: "error somewhere" }), {
                status: 404,
                headers,
            });
        }
    } catch (err) {
        console.error("Token verification error:", err);
        return new Response(JSON.stringify({ token: "error somewhere" }), {
            status: 500,
            headers,
        });
    }
}
