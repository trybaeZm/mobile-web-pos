'use client'
import { createCookie, storeData } from '@/lib/createCookie';
import { LoginAuth } from '@/services/auth/Auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Eye, EyeOff, Loader2, Shield, ShoppingCart, Package, Activity, Users } from 'lucide-react';
import LightDarkLogo, { LightLogo } from '../Logo';
import { setUserDetails } from '@/store/features/userDetailsSlice';
import Link from 'next/link';
// import { GoogleAuthButton } from './component/GoogleAuthButton';
import { useSnackbar } from '@/context/SnackbarContext';
import bgimage from '@/assets/images/signup-bg.png';

interface AuthFormData {
    email: string;
    password: string;
}

const Signup = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<AuthFormData>({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const dispatch = useDispatch();
    const { show } = useSnackbar();

    const handleInputChange = (field: keyof AuthFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            const result = await LoginAuth(formData);
            console.log(result);

            if (result.userdata != null) {
                createCookie(result.Token);
                storeData(result.userdata);
                dispatch(setUserDetails(result.userdata));
                show('Login successful! Redirecting...', 'success');
                setSuccess(true);

                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                show(result.message || 'Login failed', 'error');
            }
        } catch (err: any) {
            console.log(err);
            show(err.message || err.response?.data?.message || 'Something went wrong. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: <ShoppingCart className="w-5 h-5" />, text: "Fast & Reliable Checkout" },
        { icon: <Package className="w-5 h-5" />, text: "Inventory Management" },
        { icon: <Activity className="w-5 h-5" />, text: "Real-time Sales Tracking" },
        { icon: <Users className="w-5 h-5" />, text: "Customer Loyalty Program" }
    ];

    const isFormValid = formData.email && formData.password;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex">
            {/* Left Panel - Brand & Features */}
            <div
                className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
                style={{
                    backgroundImage: `url('${bgimage.src}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[2px] z-0"></div>

                <div className="relative z-10 flex items-center gap-3 mb-12">
                    <div>
                        <LightLogo className='h-8 text-white' />
                        <p className="text-white text-sm">Point of Sale System</p>
                    </div>
                </div>

                <div className="relative z-10 space-y-8">
                    <div>
                        <h2 className="text-4xl font-bold mb-4 leading-tight text-white shadow-sm">
                            Streamline Your Sales Operations
                        </h2>
                        <p className="text-blue-50 text-lg leading-relaxed shadow-sm">
                            inXource POS provides a robust solution for managing sales, inventory,
                            and customer relationships effortlessly—all in one integrated platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-md border border-white/10 shadow-lg transition-transform hover:scale-105">
                                <div className="text-blue-300">{feature.icon}</div>
                                <span className="text-sm font-medium text-white">{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-blue-200 text-sm">
                    © 2026 Inxource. All rights reserved.
                </div>
            </div>

            {/* Right Panel - Auth Form */}
            <div className="flex-1 dark:bg-boxdark-2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="flex flex-col items-center gap-3">
                            <LightDarkLogo className='h-8' />
                            <p className="text-gray-900 dark:text-white text-sm">Business Intelligence Platform</p>
                        </div>
                    </div>

                    {/* Auth Card */}
                    <div className="bg-white/80 dark:bg-boxdark-2 backdrop-blur-xl rounded-3xl lg:shadow-2xl lg:border border-gray-200/50 dark:border-strokedark/50 p-0 lg:p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Welcome Back
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Sign in to your account
                            </p>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-6 text-gray-700 dark:text-gray-300">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-bodydark2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        disabled={loading}
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/50 dark:bg-form-input border border-gray-200 dark:border-form-strokedark rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                        placeholder="Enter your email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-bodydark2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        disabled={loading}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className="w-full px-4 py-3 bg-white/50 dark:bg-form-input border border-gray-200 dark:border-form-strokedark rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50 pr-12 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={!isFormValid || loading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Signing in...
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        {/* Forgot Password */}
                        <div className="text-center mt-4">
                            <Link href="/forgot-Password" className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
