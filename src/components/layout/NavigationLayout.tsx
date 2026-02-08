'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    ShoppingCart,
    Menu,
    X,
    Settings,
    LogOut,
    Store
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

import { useDispatch } from 'react-redux';
import { clearUserDetails } from '@/store/features/userDetailsSlice';
import { removeData, getOrgData } from '@/lib/createCookie';
import { BusinessType } from '@/types/businesses';

interface NavigationLayoutProps {
    children: React.ReactNode;
}

export default function NavigationLayout({ children }: NavigationLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [businessName, setBusinessName] = useState<string>('');

    useEffect(() => {
        const businessData = getOrgData() as BusinessType | null;
        if (businessData && businessData.business_name) {
            setBusinessName(businessData.business_name);
        }
    }, []);

    // Hide navigation on auth pages
    if (pathname === '/signin' || pathname === '/signup') {
        return <>{children}</>;
    }

    const navItems = [
        { name: 'Business', href: '/', icon: LayoutDashboard },
        { name: 'POS', href: '/pos', icon: ShoppingCart },
        { name: 'Inventory', href: '/inventory', icon: Store }, // Placeholder route
        { name: 'Settings', href: '/settings', icon: Settings }, // Placeholder route
    ];

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleSignOut = async () => {
        // Clear user details from Redux
        dispatch(clearUserDetails());
        // Remove token and business data
        await removeData();
        // Redirect to signin
        router.push('/signin');
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
            {/* Sidebar Details - Desktop: static, Mobile: fixed & toggleable */}
            <aside
                className={`
                    absolute left-0 top-0 z-50 flex h-screen w-72.5 flex-col overflow-y-hidden bg-white dark:bg-boxdark duration-300 ease-linear dark:border-strokedark lg:static lg:translate-x-0
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    border-r border-gray-200 dark:border-gray-800
                `}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">{businessName ? businessName.charAt(0) : 'T'}</span>
                        </div>
                        <span className="text-xl font-bold text-gray-800 dark:text-white">{businessName || 'Trybae POS'}</span>
                    </Link>

                    <button
                        onClick={toggleSidebar}
                        className="block lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Sidebar Menu */}
                <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
                    <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
                        <div>
                            <h3 className="mb-4 ml-4 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                Menu
                            </h3>
                            <ul className="mb-6 flex flex-col gap-1.5">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className={`
                                                    group relative flex items-center gap-2.5 rounded-lg px-4 py-2 font-medium duration-300 ease-in-out
                                                    ${isActive
                                                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                                                    }
                                                `}
                                                onClick={() => setIsSidebarOpen(false)} // Close sidebar on mobile select
                                            >
                                                <item.icon className="w-5 h-5" />
                                                {item.name}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </nav>

                    {/* Footer / Sign Out */}
                    <div className="mt-auto px-6 py-8">
                        <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-2.5 rounded-lg px-4 py-2 text-left font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Content Area */}
            <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
                {/* Mobile Header / Hamburger */}
                <header className="sticky top-0 z-40 flex w-full bg-white dark:bg-boxdark drop-shadow-1 dark:bg-gray-900 dark:drop-shadow-none lg:hidden border-b border-gray-200 dark:border-gray-800">
                    <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button
                                aria-controls="sidebar"
                                onClick={toggleSidebar}
                                className="z-50 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
                            >
                                <Menu className="w-6 h-6 text-gray-700 dark:text-white" />
                            </button>
                            <Link href="/" className="flex items-center gap-2 lg:hidden">
                                {/* Mobile Logo if needed, or just text */}
                                <span className="text-lg font-bold text-gray-800 dark:text-white">Trybae POS</span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-3 2xsm:gap-7">
                            {/* Mobile Header Right Side (e.g. Theme Toggle if not in sidebar) */}
                            {/* Theme toggle is fixed bottom right in layout, but could be here too */}
                        </div>
                    </div>
                </header>

                <main>
                    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
                        {children}
                    </div>
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden glass-effect"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}
