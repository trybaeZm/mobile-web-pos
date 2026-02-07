import React, { useState } from 'react'
import { CartItem } from '../Pos';
import { CheckCircle2, Mail, Minus, Plus, ShoppingCart, Trash2, User, UserPlus, UserX, X } from 'lucide-react';
import { StepByStepTransaction, StepByStepTransaction2 } from './ConfirmDialog';
import { Customers } from '@/types/Customers';


interface CartInterface {
    cart: CartItem[],
    setCart: (data: []) => void
    updateQuantity: (data: string, number: number) => void
    removeFromCart: (id: string) => void
    paymentStep: string
    setPaymentStep: (data: string) => void
    cashAmount: string
    setPayableUSerData: (data: Partial<Customers> | null) => void
    calculateChange: (number: string) => void
    setCustomerName: (number: string) => void
    setCustomerEmail: (number: string) => void
    selectedPayment: string
    customerEmail: string
    customerName: string
    changeAmount: number
    processPayment: (userData: Partial<Customers> | null) => void
}

export const CartPaymentSection = ({ cart, setPayableUSerData, setCart, customerName, customerEmail, setCustomerName, setCustomerEmail, updateQuantity, changeAmount, calculateChange, removeFromCart, paymentStep, selectedPayment, setPaymentStep, cashAmount, processPayment }: CartInterface) => {
    const [showDialog, setShowDialog] = useState(false)
    const [showDialog2, setShowDialog2] = useState(false)
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const discount = 0; // Can be implemented later
    const total = subtotal - discount;


    const handleConfirm = (userData: Partial<Customers> | null) => {
        if (userData) {
            processPayment(userData)
            setShowDialog(false)
        }
    }

    const [isExpanded, setIsExpanded] = useState(false);

    // Toggle expand for mobile
    const toggleExpand = () => setIsExpanded(!isExpanded);

    return (
        <>
            <StepByStepTransaction
                isOpen={showDialog}
                onClose={() => setShowDialog(false)}
                onComplete={handleConfirm}
            />

            <StepByStepTransaction2
                isOpen={showDialog2}
                onClose={() => setShowDialog2(false)}
                onComplete={handleConfirm}
            />
            <div className="space-y-6">

                {/* Cart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 lg:p-6 shadow-lg lg:shadow-xl transition-all duration-300">
                    {/* Header - Clickable on Mobile to Toggle */}
                    <div
                        className="flex items-center justify-between mb-0 lg:mb-4 cursor-pointer lg:cursor-default"
                        onClick={toggleExpand}
                    >
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                                <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    Cart
                                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">({cart.length} items)</span>
                                </h2>
                                {/* Mobile Mini Summary */}
                                <div className="lg:hidden text-xs text-gray-500 dark:text-gray-400">
                                    Total: <span className="font-bold text-gray-900 dark:text-white">K{total.toFixed(2)}</span>
                                    {isExpanded ? ' (Tap to collapse)' : ' (Tap to expand)'}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">

                            {cart.length > 0 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setCart([]); }}
                                    className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                            {/* Chevron for mobile? */}
                            <div className="lg:hidden text-gray-400">
                                {isExpanded ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                            </div>
                        </div>
                    </div>

                    {/* Content - Hidden on Mobile unless Expanded, Always visible on Desktop */}
                    <div className={`${isExpanded ? 'block' : 'hidden'} lg:block mt-4 lg:mt-0 transition-all duration-300`}>
                        {cart.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400 border-t border-dashed border-gray-200 dark:border-gray-700 mt-4 pt-8">
                                <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>Your cart is empty</p>
                                <p className="text-sm opacity-70">Add products to get started</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[50vh] lg:max-h-96 overflow-y-auto pr-1 custom-scrollbar mt-4">
                                {cart.map(item => (
                                    <div key={item.product.id} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-800 bg-gray-50/50 dark:bg-gray-700/20 rounded-xl transition-all">
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 dark:text-white text-sm lg:text-base line-clamp-1">{item.product.name}</h4>
                                            <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">K {item.product.price.toFixed(2)} × {item.quantity}</p>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-100 dark:border-gray-700">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, item.quantity - 1); }}
                                                className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                            >
                                                <Minus className="w-3 h-3 lg:w-4 lg:h-4" />
                                            </button>
                                            <span className="w-6 text-center text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, item.quantity + 1); }}
                                                className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                            >
                                                <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Cart Summary */}
                        {cart.length > 0 && (
                            <div className="mt-6 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                    <span className="text-gray-900 dark:text-white font-medium">K{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Discount</span>
                                    <span className="text-green-500 dark:text-green-400 font-medium">-K{discount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t border-dashed border-gray-200 dark:border-gray-700 pt-3">
                                    <span className="text-gray-900 dark:text-white">Total</span>
                                    <span className="text-blue-600 dark:text-blue-400">K{total.toFixed(2)}</span>
                                </div>

                                <div className="flex gap-3 flex-col sm:flex-row pt-2">
                                    {/* Anonymous Checkout */}
                                    <button
                                        onClick={() => setShowDialog(true)}
                                        disabled={cart.length === 0}
                                        className="grow py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                    >
                                        <UserX className="w-4 h-4" />
                                        Skip Details
                                    </button>

                                    {/* User Checkout */}
                                    <button
                                        onClick={() => setShowDialog2(true)}
                                        disabled={cart.length === 0}
                                        className="grow py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 text-sm"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>


            </div>
        </>
    )
}
