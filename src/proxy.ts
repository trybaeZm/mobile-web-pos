import { NextRequest, NextResponse } from 'next/server'
import { checkIfTokenIsNotExpired } from './services/token'

export async function proxy(req: NextRequest) {
    const token = req.nextUrl.searchParams.get('token')
    let localToken = req.cookies.get('userToken')?.value

    const res = NextResponse.next()

    // 🔹 Step 1: Handle token from query parameter
    if (token) {
        console.log('[Middleware] Token found in query params')
        res.cookies.set('userToken', token, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        })
        localToken = token
    }

    // 🔹 Step 2: Check if token is expired
    if (localToken && !checkIfTokenIsNotExpired(localToken)) {
        console.log('[Middleware] Token expired')
        return NextResponse.redirect(new URL('/signin', req.url))
    }

    // 🔹 Step 3: Redirect if no token found
    if (!localToken && !token) {
        console.log('[Middleware] No token found, redirecting to signin')
        return NextResponse.redirect(new URL('/signin', req.url))
    }

    console.log('[Middleware] Token valid, allowing access')
    return res
}

// ✅ Apply middleware to protected routes
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api/* (API routes)
         * - signin (login page)
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         */
        '/((?!api|signin|_next/static|_next/image|favicon.ico).*)',
    ],
}
