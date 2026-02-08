'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-gray-900">
            <h1 className="text-9xl font-extrabold text-gray-200 dark:text-gray-800">404</h1>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white md:text-3xl">Page not found</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">Sorry, we couldn't find the page you're looking for.</p>
                <div className="mt-8 flex justify-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                        Go Back
                    </button>
                    <Link
                        href="/"
                        className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
