'use client'
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { getBusinessByOwnerID } from '@/services/api/apiBusiness';
import { BusinessType } from '@/types/businesses';
import { BusinessCard } from '@/components/pos/components/BusinessCard';
import { AlertCircle, Filter, Plus, Search, X } from 'lucide-react';
import { storeOrgData } from '@/lib/createCookie';

export default function Home() {
  const user = useSelector((state: RootState) => state.userDetails);
  const router = useRouter();
  const [businesses, setBusinesses] = useState<BusinessType[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const fetchBusinesses = async () => {
    if (!user?.id) return;
    setLoading(true);
    setError('');
    try {
      const data = await getBusinessByOwnerID(user.id);
      setBusinesses(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load businesses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchBusinesses();
    } else {
      setLoading(false)
    }
  }, [user?.id]);

  const handleSelectBusiness = (business: BusinessType) => {
    storeOrgData(business);
    router.push('/pos');
  };

  const filteredBusinesses = businesses?.filter(b =>
    b.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.company_alias.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-sm animate-pulse"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 space-y-8">
      {/* Header with Expandable Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 h-14">
        {!isSearchOpen && (
          <div className="animate-in fade-in duration-200">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 dark:from-gray-100 dark:to-purple-400 bg-clip-text text-transparent">
              Select Business
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Choose a business to proceed to the Point of Sale
            </p>
          </div>
        )}

        <div className={`flex items-center gap-2 ${isSearchOpen ? 'w-full' : ''}`}>
          {isSearchOpen ? (
            <div className="relative flex-1 animate-in fade-in slide-in-from-right-10 duration-200">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                autoFocus
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 shadow-lg outline-none"
              />
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery('');
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:shadow-md transition-all text-gray-600 dark:text-gray-300 ml-auto"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>


      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={fetchBusinesses}
            className="ml-auto text-sm bg-red-100 dark:bg-red-800/30 hover:bg-red-200 dark:hover:bg-red-700/30 px-3 py-1 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : !user?.id ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Please log in to view businesses</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBusinesses?.map((business) => (
            <BusinessCard
              key={business.id}
              data={business}
              onSelect={handleSelectBusiness}
            />
          ))}
          {filteredBusinesses && filteredBusinesses.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              No businesses found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
