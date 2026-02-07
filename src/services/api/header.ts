import { allowedOrigins } from "@/utils/routesfunc";

// ✅ Function to get dynamic CORS headers
export function getCorsHeaders(request: Request): Record<string, string> {
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


export const apiKey = 'M2DAmZN53yGEemVf02efCFFxd44X7PkH'; // Replace with your actual API key
export const apiID = 'pk_live_vR2gMtoqrDwI5iJ5himvnpeC'; // Replace with your actual API ID
