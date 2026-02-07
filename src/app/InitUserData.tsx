'use client'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getToken } from '@/lib/createCookie'
import { setUserDetails } from '@/store/features/userDetailsSlice'
import LightDarkLogo from '@/components/Logo'
import { usePathname, useRouter } from 'next/navigation'

export default function InitUserData({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch()
    const [loader, setLoader] = useState(true)
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        const getUserDataFromApi = async () => {
            try {
                setLoader(true)
                const token = getToken()
                if (!token) {
                    setLoader(false)
                    return
                }
                const response = await fetch('/api/refreshtoken', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token }),
                })

                if (!response.ok) {
                    console.error('Failed to refresh token:')
                    return
                }

                const result = await response.json()
                if (result?.user) {
                    dispatch(setUserDetails(result.user))
                }
            } catch (err) {
                console.error('Error fetching user data:', err)
                console.log('Error fetching user data:', err)
            } finally {
                setLoader(false)
            }
        }
        getUserDataFromApi()
    }, [dispatch])

    useEffect(() => {
        // Skip root route and auth routes
        if (pathname === '/' || pathname === '/subscribe' || pathname === '/signin' || pathname === '/payment' || pathname === "/forgot-Password" || pathname === "/auth/callback") return

        // For POS, we probably just enforce Auth?
        // Dashboard enforces BusinessID checks here.
        // We will keep similar logic but strict to auth.
        const token = getToken();
        if (!token && pathname !== '/signin') {
            router.replace('/signin');
        }

        /*
        // Check sessionStorage for BusinessID
        const business = sessionStorage.getItem('BusinessID')
        if (!business) {
            console.log('BusinessID missing, redirecting to root')
            router.replace('/') // Client-side redirect
        }
        */
    }, [pathname, router])

    // Enhanced loading skeleton with better animations{
    if (loader && pathname !== '/signin') {
        return (
            <div className="flex h-screen  bg-gray-50  dark:bg-gray-900 ">
                <div className="flex-1 flex items-center justify-center">
                    <LightDarkLogo className="h-20 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <>
            {children}
        </>
    )
}
