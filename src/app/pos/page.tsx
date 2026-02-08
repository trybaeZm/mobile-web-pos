'use client'
import React, { useEffect, useState } from 'react';
import POSPage from '@/components/pos/Pos';
import { useRouter } from 'next/navigation';
import { BusinessType } from '@/types/businesses';
import { getOrgData } from '@/lib/createCookie';


export default function PosRoute() {
    const router = useRouter();
    const [selectedBusiness, setSelectedBusiness] = useState<BusinessType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const business = getOrgData() as BusinessType | null;

        if (!business) {
            router.push('/');
            return;
        }

        setSelectedBusiness(business);
        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!selectedBusiness) return null;

    return (
        <POSPage business={selectedBusiness} />
    );
}
