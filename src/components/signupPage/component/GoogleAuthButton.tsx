import { SignUpwithGoogle } from '@/services/apiUsers';

import Image from 'next/image';
import React from 'react'

interface GooglebtnTypes {
    isLogin?: boolean;
}
export const GoogleAuthButton = ({ isLogin }: GooglebtnTypes) => {
    const [loading, setLoading] = React.useState(false);


    const handleGoogleAuth = async () => {
        setLoading(true);
        // Implement Google OAuth flow here
        try {
            await SignUpwithGoogle();
            console.log("Google Auth Clicked");
        } catch (error) {
            console.error("Google Auth Error: ", error);
        } finally {
            setLoading(false);
        }
    }


    return (
        <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] disabled:opacity-60"
        >
            <span className="text-gray-700 dark:text-gray-200 font-medium">
                {
                    loading ? (isLogin ? 'Signing in...' : 'Signing up...') : (isLogin ? 'Sign in with Google' : 'Sign up with Google')
                }

            </span>
        </button>
    )
}
