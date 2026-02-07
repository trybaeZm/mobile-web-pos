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
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5" />
                            Cart ({cart.length})
                        </h2>
                        {cart.length > 0 && (
                            <button
                                onClick={() => setCart([])}
                                className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1"
                            >
                                <Trash2 className="w-4 h-4" />
                                Clear
                            </button>
                        )}
                    </div>

                    {cart.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Your cart is empty</p>
                            <p className="text-sm">Add products to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {cart.map(item => (
                                <div key={item.product.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 dark:text-white">{item.product.name}</h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">K {item.product.price.toFixed(2)} × {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, item.quantity - 1); }}
                                            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.product.id, item.quantity + 1); }}
                                            className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); removeFromCart(item.product.id); }}
                                            className="p-1 text-red-500 hover:text-red-600 ml-2"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* Cart Summary */}
                    {cart.length > 0 && (
                        <div className="mt-6 space-y-2 border-t border-gray-200 dark:border-gray-600 pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                <span className="text-gray-900 dark:text-white">K{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                                <span className="text-green-500 dark:text-green-400">K{discount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-600 pt-2">
                                <span className="text-gray-900 dark:text-white">Total:</span>
                                <span className="text-blue-500 dark:text-blue-400">K{total.toFixed(2)}</span>
                            </div>

                            <div className="flex gap-3 flex-wrap">
                                {/* Anonymous Checkout */}
                                <button
                                    onClick={() => setShowDialog(true)}
                                    disabled={cart.length === 0}
                                    className="grow py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
                                >
                                    <UserX className="w-5 h-5" />
                                    Skip Customer Details
                                </button>

                                {/* User Checkout */}
                                <button
                                    onClick={() => setShowDialog2(true)}
                                    disabled={cart.length === 0}
                                    className="grow py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
                                >
                                    <UserPlus className="w-5 h-5" />
                                    Record Customer Details
                                </button>
                            </div>
                        </div>
                    )}
                </div>


            </div>
        </>
    )
}
