'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Smartphone, Wallet, Receipt, X, User, Mail, CheckCircle2 } from 'lucide-react';
import { Product } from '@/types/product';
import { getOrgData } from '@/lib/createCookie';
import { getAllProducts } from '@/services/apiProducts';
import { ProductCard } from './components/ProductCard';
import { CartPaymentSection } from './components/CartPaymentSection';
import { makeOrderByMainUser } from '@/services/order/Order';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
// import OrdersManagement from '@/app/orders/page'; // Commented out to avoid error for now
import { LoadingDialog } from './components/LoadingDialog';
import { SuccessDialog } from './components/SuccessDialog';
import { FailedDialog } from './components/FailedDialog'; // Fixed Typo
import { Customers } from '@/types/Customers';
import { getInventory } from '@/services/api/apiinventory';
import { InventoryResponses } from '@/types/inventoryTypes';



export interface CartItem {
    product: Product
    quantity: number
    subtotal: number

}

import { BusinessType } from '@/types/businesses';

interface POSPageProps {
    business?: BusinessType;
}

export default function POSPage({ business }: POSPageProps) {
    const [products, setProducts] = useState<Product[]>();
    const [productsInv, setProductsInv] = useState<InventoryResponses[] | null>(null);
    const [loading, setLoading] = useState(false)
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paystatus, setPayStatus] = useState('')
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [paymentStep, setPaymentStep] = useState<string>('cart');
    const [selectedPayment, setSelectedPayment] = useState<string>('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [cashAmount, setCashAmount] = useState('');
    const [changeAmount, setChangeAmount] = useState(0);
    const [payableUserData, setPayableUSerData] = useState<Partial<Customers> | null>(null)
    // const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    const businessData = business || getOrgData()
    const userData = useSelector((state: RootState) => state.userDetails)


    const categories = ['All', ...new Set(products?.map((p: any) => p.category))];

    const filteredProducts = products?.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * product.price }
                        : item
                );
            }
            return [...prev, { product, quantity: 1, subtotal: product.price }];
        });
    };

    const updateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart(prev =>
            prev.map(item =>
                item.product.id === productId
                    ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.product.price }
                    : item
            )
        );
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const processPayment = async (userData: Partial<Customers> | null) => {
        if (!userData) {
            console.log("user not Found")
            setPayStatus("failed")
            return
        }

        setLoading(true)
        // Ensure business_id is attached for new customer creation flows

        const enrichedUserData = { ...userData, business_id: businessData.id };
        setPayableUSerData(enrichedUserData)

        const formattedCart = cart.map((item) => ({
            id: item.product.id,
            product_id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            description: item.product.description || "",
            subtotal: item.subtotal,
            business_id: item.product.business_id || "",
            specialInstructions: ""
        }));

        try {
            const orderResponse = await makeOrderByMainUser(formattedCart, enrichedUserData, businessData.id)
            if (orderResponse) {
                setPayStatus('success')
                setCart([])
                getProducts()
            } else {
                setPayStatus("failed")
            }
        } catch (error) {
            console.log(error)
            setPayStatus("failed")
        } finally {
            setLoading(false)
        }
    };

    const calculateChange = (amount: string) => {
        const cash = parseFloat(amount) || 0;
        setCashAmount(amount);
        // setChangeAmount(cash - total);
    };

    const getProducts = () => {
        getAllProducts(businessData?.id)
            .then((res: any) => {
                if (res) {
                    setProducts(res)
                }
            })

        getInventory(businessData?.id)
            .then((res: any) => {
                if (res) {
                    setProductsInv(res.allInventory)
                }
            })
    }


    useEffect(() => {
        getProducts()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>

            <LoadingDialog
                isOpen={loading}
            />
            <SuccessDialog
                isOpen={paystatus == "success"}
                onClose={() => setPayStatus("")}
            />
            <FailedDialog
                isOpen={paystatus == "failed"}
                onClose={() => setPayStatus("")}
            />
            <div className="flex hidden flex-col items-center justify-center min-h-[60vh] text-center p-6">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-sm max-w-sm">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-30" />
                            <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-xl">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={1.5}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-purple-600 dark:from-gray-100 dark:to-purple-400 bg-clip-text text-transparent mb-3">
                        Available on Tablet & PC
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                        The Point of Sale system is optimized for larger screens to give you the best experience.
                    </p>

                    {/* Coming Soon Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800/50 rounded-xl">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                        </span>
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Mobile Coming Soon
                        </span>
                    </div>
                </div>
            </div>
            <div className=' md:block'>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Point of Sale</h1>
                            <p className="text-gray-600 dark:text-gray-400">Manage your sales and transactions</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Products Section */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Search and Filter */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="flex-1 relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type="text"
                                                placeholder="Search products..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {categories.map((category: any) => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Products Grid */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Products</h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredProducts?.map((product, key) => (
                                            <ProductCard cart={cart} key={key} productsInv={productsInv?.filter(inv => inv.id == product.id)[0]} product={product} addToCart={addToCart} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Cart & Payment Section */}
                            <CartPaymentSection
                                cart={cart}
                                setPayableUSerData={setPayableUSerData}
                                setCart={setCart}
                                customerName={customerName}
                                customerEmail={customerEmail}
                                setCustomerName={setCustomerName}
                                setCustomerEmail={setCustomerEmail}
                                updateQuantity={updateQuantity}
                                changeAmount={changeAmount}
                                calculateChange={calculateChange}
                                removeFromCart={removeFromCart}
                                paymentStep={paymentStep}
                                selectedPayment={selectedPayment}
                                setPaymentStep={setPaymentStep}
                                cashAmount={cashAmount}
                                processPayment={processPayment} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}