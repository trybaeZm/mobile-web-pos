'use client'
import { createCookie, storeData } from '@/lib/createCookie';
import { LoginAuth, SignUpAuth } from '@/services/auth/Auth';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Eye, EyeOff, Loader2, CheckCircle2, AlertCircle, Shield, Zap, Users, BarChart3 } from 'lucide-react';
import LightDarkLogo, { LightLogo } from '../Logo'; // Adjusted path if needed, but in Dashboard it is ../Logo from signupPage
import { setUserDetails } from '@/store/features/userDetailsSlice';
import Link from 'next/link';
import { GoogleAuthButton } from './component/GoogleAuthButton';
import { useSnackbar } from '@/context/SnackbarContext';
// import bgimage from '@/assets/images/signup-bg.png'; // Need to mock or remove bgimage

interface AuthFormData {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

type SignupStep = 'form' | 'verification' | 'success';

const Signup = () => {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState<AuthFormData>({ email: '', password: '', confirmPassword: '' });
    const [agreed, setAgreed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const dispatch = useDispatch();
    const { show } = useSnackbar();

    // Email verification state
    const [signupStep, setSignupStep] = useState<SignupStep>('form');
    const [verificationCode, setVerificationCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');

    // Generate a 6-digit verification code
    const generateCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    // Send verification code to email
    const sendVerificationCode = async (emailAddr: string) => {
        const backendUrl = process.env.NEXT_PUBLIC_PAYMENT_BACKEND_URL;
        const smtpUser = process.env.NEXT_PUBLIC_SMTP_USER;
        const smtpPass = process.env.NEXT_PUBLIC_SMTP_PASS;

        if (!backendUrl) {
            console.error('[Signup] NEXT_PUBLIC_PAYMENT_BACKEND_URL is not configured');
            throw new Error('Email service is not configured. Please contact support.');
        }
        if (!smtpUser || !smtpPass) {
            console.error('[Signup] SMTP credentials are not configured');
            throw new Error('Email service credentials are not configured. Please contact support.');
        }

        const emailEndpoint = `${backendUrl}/api/email/verification-code`;
        const code = generateCode();
        setGeneratedCode(code);

        console.log('[Signup] Sending verification code...');
        console.log('[Signup] Endpoint:', emailEndpoint);
        console.log('[Signup] Email:', emailAddr);

        const response = await fetch(emailEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: emailAddr,
                code: code,
                purpose: 'account_verification',
                smtpUser: smtpUser,
                smtpPass: smtpPass
            }),
        });

        console.log('[Signup] Backend response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('[Signup] Backend error:', errorData);
            throw new Error(errorData.message || 'Failed to send verification code');
        }

        return response.json();
    };

    // Verify the entered code
    const verifyCode = (enteredCode: string): boolean => {
        console.log('[Signup] Verifying code...');
        console.log('[Signup] Entered:', enteredCode, 'Expected:', generatedCode);
        return enteredCode === generatedCode;
    };

    const handleInputChange = (field: keyof AuthFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Handle verification code submission
    const handleVerifyCode = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            if (!verifyCode(verificationCode)) {
                show('Invalid verification code. Please try again.', 'error');
                setLoading(false);
                return;
            }

            show('Email verified successfully!', 'success');

            // Now create the account
            const result = await SignUpAuth({
                name: formData.name!,
                email: formData.email,
                password: formData.password
            });

            if (result.data != null) {
                createCookie(result.Token === null ? undefined : result.Token);
                storeData(result.data);
                dispatch(setUserDetails(result.data));
                show('Account created successfully!', 'success');
                setSignupStep('success');
                setSuccess(true);

                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                show(result.message || 'Signup failed', 'error');
                setSignupStep('form');
            }
        } catch (err: any) {
            console.error(err);
            show(err.response?.data?.message || 'Something went wrong. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Handle resend code
    const handleResendCode = async () => {
        setLoading(true);
        try {
            await sendVerificationCode(formData.email);
            show('Verification code resent!', 'success');
        } catch (err: any) {
            show(err.message || 'Failed to resend code', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                // Login flow - unchanged
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
            } else {
                // Signup flow - send verification code first
                if (formData.password !== formData.confirmPassword) {
                    show('Passwords do not match', 'error');
                    setLoading(false);
                    return;
                }

                await sendVerificationCode(formData.email);
                show('Verification code sent to your email!', 'success');
                setSignupStep('verification');
            }
        } catch (err: any) {
            console.log(err);
            show(err.message || err.response?.data?.message || 'Something went wrong. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setFormData({ email: '', password: '', confirmPassword: '', name: '' });
        setSuccess(false);
        setSignupStep('form');
        setVerificationCode('');
        setGeneratedCode('');
    };

    const features = [
        { icon: <Zap className="w-5 h-5" />, text: "AI-Powered Automation" },
        { icon: <Users className="w-5 h-5" />, text: "Smart Customer Management" },
        { icon: <BarChart3 className="w-5 h-5" />, text: "Advanced Analytics" },
        { icon: <Shield className="w-5 h-5" />, text: "Enterprise Security" }
    ];

    const passwordsMatch = formData.password === formData.confirmPassword;
    const isFormValid = isLogin
        ? formData.email && formData.password
        : formData.name && formData.email && formData.password && formData.confirmPassword && passwordsMatch && agreed;

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]"></div>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-lg relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-20 transform rotate-1"></div>
                <div className="relative bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">

                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-500 mb-6 shadow-lg shadow-blue-500/20">
                            <LightLogo className='h-8 text-white' />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                            {isLogin ? 'Welcome Back' : signupStep === 'verification' ? 'Verify Email' : 'Join inXource'}
                        </h2>
                        <p className="text-gray-400">
                            {isLogin
                                ? 'Sign in to access your dashboard'
                                : signupStep === 'verification'
                                    ? `Enter the code sent to ${formData.email}`
                                    : 'Start managing your business today'}
                        </p>
                    </div>

                    {/* Auto-typing features (optional creative touch) */}
                    <div className="flex justify-center gap-4 mb-8 text-xs text-gray-500 font-medium">
                        {features.slice(0, 3).map((f, i) => (
                            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                                {React.cloneElement(f.icon as any, { className: "w-3 h-3 text-blue-400" })}
                                <span>{f.text.split(' ')[0]}</span>
                            </div>
                        ))}
                    </div>

                    {/* Forms */}
                    <div className="space-y-6">
                        {/* Verification Code Form */}
                        {!isLogin && signupStep === 'verification' && (
                            <form onSubmit={handleVerifyCode} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 ml-1">Verification Code</label>
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                        className="w-full px-5 py-4 bg-gray-800/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all text-center tracking-[1em] text-lg font-mono"
                                        placeholder="000000"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Account'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    className="w-full text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Didn't receive code? Resend
                                </button>
                            </form>
                        )}

                        {/* Auth Form */}
                        {(isLogin || signupStep === 'form') && (
                            <form onSubmit={handleAuth} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {!isLogin && (
                                    <div className="space-y-1">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                className="w-full px-5 py-4 bg-gray-800/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all"
                                                value={formData.name || ''}
                                                onChange={e => handleInputChange('name', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            className="w-full px-5 py-4 bg-gray-800/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all"
                                            value={formData.email}
                                            onChange={e => handleInputChange('email', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            className="w-full px-5 py-4 bg-gray-800/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all pr-12"
                                            value={formData.password}
                                            onChange={e => handleInputChange('password', e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {!isLogin && (
                                    <div className="space-y-1">
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm Password"
                                                className="w-full px-5 py-4 bg-gray-800/50 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white placeholder-gray-500 transition-all pr-12"
                                                value={formData.confirmPassword || ''}
                                                onChange={e => handleInputChange('confirmPassword', e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {!isLogin && (
                                    <div className="flex items-center gap-3 px-1">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            checked={agreed}
                                            onChange={() => setAgreed(!agreed)}
                                            className="w-5 h-5 rounded border-white/10 bg-gray-800/50 text-blue-600 focus:ring-blue-500/40"
                                        />
                                        <label htmlFor="terms" className="text-sm text-gray-400 select-none">
                                            I agree to the <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>
                                        </label>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || (!isLogin && !isFormValid)}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-semibold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
                                </button>
                            </form>
                        )}

                        {(isLogin || signupStep === 'form') && (
                            <div className=" hidden space-y-6 pt-2">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/10"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-transparent text-gray-500 bg-[#111827]">Or continue with</span>
                                    </div>
                                </div>
                                <GoogleAuthButton isLogin={isLogin} />
                                <div className="text-center">
                                    <p className="text-gray-400">
                                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                                        <button onClick={switchMode} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                                            {isLogin ? 'Create one' : 'Sign in'}
                                        </button>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
