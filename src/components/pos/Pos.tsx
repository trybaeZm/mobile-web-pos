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
            {/* Mobile Restriction Removed */}

            <div className='block min-h-screen bg-gray-50 dark:bg-gray-900 p-4 pb-20 lg:p-4'> {/* Added pb-20 for mobile scroll space if needed */}
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Point of Sale</h1>
                        <p className="text-gray-600 dark:text-gray-400">Manage your sales and transactions</p>
                    </div>

                    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">

                        {/* Cart & Payment Section - Mobile: Top, Desktop: Right */}
                        <div className="order-1 lg:order-2 lg:col-span-1 sticky top-2 z-20 lg:static">
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

                        {/* Products Section - Mobile: Bottom, Desktop: Left */}
                        <div className="order-2 lg:order-1 lg:col-span-2 space-y-6">
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


                    </div>
                </div>
            </div>
        </>
    );
}