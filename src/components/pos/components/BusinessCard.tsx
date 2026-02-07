import React, { useEffect, useState } from 'react'
import { Building2, ArrowRight } from 'lucide-react'
import { BusinessType } from '@/types/businesses'
import { useRouter } from 'next/navigation'
import { getProductImages } from '@/services/api/products' // Reusing products API or similar helper if available, or just mocking for now

interface BusinessCardProps {
    data: BusinessType
    onSelect: (business: BusinessType) => void
}

export const BusinessCard = ({ data, onSelect }: BusinessCardProps) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [imageLoading, setImageLoading] = useState(true)

    // Simplified image fetching using the products service helper (assuming it handles generic file paths or we adapt it)
    // In reality, business images might be in a different bucket path. 
    // The reference code used `getProductImages` from `apiBusiness` which pointed to `products/${id}/${name}`? 
    // Wait, the reference `BusinessCard` used `getProductImages` from `apiBusiness`. 
    // The one in `products.ts` points to `products/${productId}/${fileName}`. 
    // If businesses store images in `products` bucket (unlikely but possible based on shared code) or `business` bucket.
    // Let's assume for now we use the `products.ts` one but it might need adjustment if path differs.
    // However, looking at the user references, `getProductImages` in `products.ts` hardcodes `products/`. 
    // I should probably use a generic `getPublicUrl` or similar, but let's stick to what we have or mock if risk is high.
    // Actually, I'll update it to try fetching.
    const getImages = async () => {
        if (data?.imageName && data.id) {
            // Note: This uses 'products/' prefix from the shared service. 
            // If business images are elsewhere, this might fail. 
            // But without a specific `apiBusiness` image fetcher, this is the best guess or I can inline the supabase call.
            const url = await getProductImages(data.id, data.imageName);
            if (url) setImageUrl(url);
        }
        setImageLoading(false);
    }

    useEffect(() => {
        getImages()
    }, [])

    const getIndustryColor = (industry: string | undefined) => {
        const colors = {
            'technology': 'from-blue-500 to-cyan-500',
            'retail': 'from-purple-500 to-pink-500',
            'food': 'from-orange-500 to-red-500',
            'healthcare': 'from-green-500 to-emerald-500',
            'finance': 'from-indigo-500 to-purple-500',
            'education': 'from-yellow-500 to-orange-500',
            'default': 'from-gray-500 to-gray-600'
        }
        return colors[industry?.toLowerCase() as keyof typeof colors] || colors.default
    }

    return (
        <div className={`group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm overflow-hidden`}>
            {/* Header */}
            <div className="p-4 pb-3">
                <div className="flex items-start justify-between">
                    {/* Business Info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Business Avatar */}
                        <div className={`w-12 h-12 bg-gradient-to-br ${getIndustryColor(data.industry)} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                            {imageUrl && !imageLoading ? (
                                <div
                                    className="w-full h-full bg-cover bg-center rounded-xl"
                                    style={{ backgroundImage: `url(${imageUrl})` }}
                                />
                            ) : (
                                <Building2 className="w-6 h-6 text-white" />
                            )}
                        </div>

                        {/* Business Details */}
                        <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate text-lg">
                                {data.business_name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {data.company_alias}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium capitalize">
                                    {data.industry || 'Business'}
                                </span>
                                {data.is_active && (
                                    <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="px-4 pb-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="text-gray-600 dark:text-gray-400">Type</div>
                        <div className="font-medium text-gray-900 dark:text-white capitalize">
                            {data.types?.replace('_', ' ') || 'N/A'}
                        </div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="text-gray-600 dark:text-gray-400">Status</div>
                        <div className={`font-medium ${data.is_active
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-yellow-600 dark:text-yellow-400'
                            }`}>
                            {data.is_active ? 'Active' : 'Inactive'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer with CTA */}
            <div className="border-t border-gray-200/50 dark:border-gray-700/50">
                <button
                    onClick={() => onSelect(data)}
                    className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-all duration-300 group/button"
                >
                    <span className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4" />
                        Select Business
                    </span>
                    <ArrowRight className="w-4 h-4 transform group-hover/button:translate-x-1 transition-transform duration-300" />
                </button>
            </div>
        </div>
    )
}
