import React, { useState } from 'react';
import {
    AlertTriangle,
    X,
    Info,
    CheckCircle2,
    Search,
    User,
    UserPlus,
    CreditCard,
    Receipt,
    Store,
    Clock,
    Shield,
    CheckCircle,
    UserCheck,
    Mail,
    MapPin,
    Users,
    Phone,
    ArrowLeft,
    ArrowRight,
    AlertCircle
} from 'lucide-react';
import { createNormalUser, getCustomerbyPhoneandBusiness } from '@/services/apiCustomers';
import { getOrgData } from '@/lib/createCookie';
import { Customers } from '@/types/Customers';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';


interface StepByStepTransactionProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (userData: Partial<Customers> | null) => void;
    isLoading?: boolean;
}


export const StepByStepTransaction = ({
    isOpen,
    onClose,
    onComplete,
    isLoading = false
}: StepByStepTransactionProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedOption, setSelectedOption] = useState<'Anonymous'>('Anonymous');
    const [searchPhone, setSearchPhone] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [userExists, setUserExists] = useState<boolean | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const businessData = getOrgData()
    const userData = useSelector((state: RootState) => state.userDetails)

    if (!isOpen) return null;

    const variantStyles = {
        warning: {
            icon: AlertTriangle,
            iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
            iconColor: 'text-yellow-600 dark:text-yellow-400',
            button: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
        },
        danger: {
            icon: AlertCircle,
            iconBg: 'bg-red-100 dark:bg-red-900/30',
            iconColor: 'text-red-600 dark:text-red-400',
            button: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
        },
        info: {
            icon: Info,
            iconBg: 'bg-blue-100 dark:bg-blue-900/30',
            iconColor: 'text-blue-600 dark:text-blue-400',
            button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
        },
        success: {
            icon: CheckCircle2,
            iconBg: 'bg-green-100 dark:bg-green-900/30',
            iconColor: 'text-green-600 dark:text-green-400',
            button: 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
        }
    };

    const { icon: Icon, iconBg, iconColor, button } = variantStyles['success'];

    const resetForm = () => {
        setCurrentStep(1);
        setSearchPhone('');
        setUserExists(null);
        setPaymentAmount('');
    };

    const handleComplete = () => {
        try {
            onComplete(userData);
        } finally {
            resetForm()
        }
    };

    const handleClose = () => {
        resetForm()
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full animate-scaleIn">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${iconBg}`}>
                            <Icon className={`w-6 h-6 ${iconColor}`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Anonymous Payment
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Quick retail transaction
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-6">


                        {/* Transaction Summary */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-4 border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <h4 className="font-semibold text-gray-900 dark:text-white">Transaction Summary</h4>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">Customer Type:</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-green-500" />
                                        <span className="font-medium text-gray-900 dark:text-white capitalize">{selectedOption}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Store className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">Business:</span>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">{businessData?.name || 'Retail Store'}</span>
                                </div>

                                <div className="flex justify-between items-center py-2">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                        <span className="text-gray-600 dark:text-gray-400">Transaction Time:</span>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>



                        {/* Caution Notice */}
                        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-xl p-4">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                                    Important Notice
                                </p>
                                <p className="text-sm text-amber-800 dark:text-amber-200">
                                    This anonymous transaction will be <strong>processed immediately</strong> and cannot be reversed. Receipt will be generated for retail records.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Cancel
                    </button>
                    <button
                        onClick={() => handleComplete()}
                        disabled={isLoading}
                        className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Confirm Payment
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};


export const StepByStepTransaction2 = ({
    isOpen,
    onClose,
    onComplete,
    isLoading = false,
}: StepByStepTransactionProps) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedOption, setSelectedOption] = useState<'admin' | 'current' | 'customer' | null>(null);
    const [userAccount, setUserAccount] = useState<Partial<Customers> | null>(null);
    const [userAccount2, setUserAccount2] = useState<Partial<Customers> | null>(null);
    const [searchPhone, setSearchPhone] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [userExists, setUserExists] = useState<boolean | null>(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [isLoadingHere, setIsLoadingHere] = useState(false);
    const businessData = getOrgData()


    if (!isOpen) return null;

    const zambianTowns = [
        "Lusaka", "Ndola", "Kitwe", "Livingstone", "Chipata", "Chingola", "Mansa",
        "Kabwe", "Kasama", "Solwezi", "Mongu", "Mazabuka", "Kafue", "Luanshya",
        "Kalulushi", "Kapiri Mposhi", "Choma", "Siavonga", "Mpika", "Petauke",
        "Katete", "Isoka", "Nakonde", "Mumbwa", "Serenje", "Samfya", "Monze",
        "Lundazi", "Chililabombwe", "Namwala", "Zimba", "Mbala", "Chadiza", "Kaoma",
        "Itezhi-Tezhi", "Maamba", "Senanga", "Chavuma", "Nchelenge", "Kawambwa",
        "Kalabo", "Mpongwe", "Lukulu", "Chama", "Nyimba", "Mwense", "Chilubi",
        "Milenge", "Chembe", "Mwinilunga", "Nakambala", "Kalengwa", "Kasumbalesa",
        "Mufulira", "Shangombo", "Mutanda"
    ];

    // Mock function to search for user
    const searchUser = async (phoneNumber: string) => {
        setIsSearching(true);
        try {
            const responsefromCustomerTable = await getCustomerbyPhoneandBusiness(phoneNumber, businessData.id)
            if (responsefromCustomerTable) {
                setUserExists(true);
                setUserAccount(responsefromCustomerTable);
            } else {
                setUserExists(false)
                setUserAccount2({ ...userAccount2, phone: searchPhone });

            }
        } catch (error) {
            console.error("Error searching user:", error);
            setUserExists(false);
        } finally {
            setIsSearching(false);
        }
    };

    const handleStep2Continue = async () => {
        if (userAccount) {
            setCurrentStep(2);
        } else {
            setUserAccount(null)
            if (userAccount2) {
                console.log(userAccount2)
                try {
                    setIsLoadingHere(true)
                    const resp = await createNormalUser(userAccount2)
                    if (resp) {
                        setCurrentStep(2);
                        setUserAccount2(resp)
                    }
                } catch {

                } finally {
                    setIsLoadingHere(false)
                }
            }
        }
    };

    const handleComplete = () => {
        onClose()
        try {
            if (userAccount2) {
                onComplete(userAccount2);
            } else {
                onComplete(userAccount);
            }
        } catch {

        } finally {
            resetForm();
        }
    };

    const resetForm = () => {
        setCurrentStep(1);
        setSelectedOption(null);
        setUserAccount(null);
        setSearchPhone('');
        setUserExists(null);
        setUserAccount2(null);
        setPaymentAmount('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const renderStep2 = () => (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="flex justify-center mb-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        {userExists ? (
                            <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        ) : (
                            <UserPlus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        )}
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {userExists ? 'Customer Found' : 'Create Customer Account'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    {userExists
                        ? 'We found an existing customer with this phone number'
                        : 'Please enter customer details to continue'
                    }
                </p>
            </div>

            {/* Phone Search */}
            <div className="space-y-4">
                {/* Search Section */}
                <div>
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="tel"
                                value={searchPhone}
                                onChange={(e) => setSearchPhone(e.target.value)}
                                placeholder="Enter phone number"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <button
                            onClick={() => searchUser(searchPhone)}
                            disabled={!searchPhone || isSearching}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all duration-200"
                        >
                            {isSearching ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Search className="w-4 h-4" />
                            )}
                            Search
                        </button>
                    </div>
                </div>

                {/* Search Status Indicator */}
                {(userExists && userAccount) && (
                    <div
                        className={`p-4 text-gray-600 dark:text-gray-400  rounded-xl border flex flex-col gap-3 ${userExists
                            ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800"
                            : "bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {userExists ? (
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                            ) : (
                                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            )}

                            <span
                                className={`text-sm font-medium ${userExists
                                    ? "text-green-700 dark:text-green-300"
                                    : "text-blue-700 dark:text-blue-300"
                                    }`}
                            >
                                {userExists
                                    ? "Customer found in the system"
                                    : "New customer — not found in records"}
                            </span>
                        </div>

                        {/* Customer Details Display */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div>
                                <span className="text-muted-foreground">Name</span>
                                <p className="font-semibold">
                                    {userAccount?.name || "—"}
                                </p>
                            </div>

                            <div>
                                <span className="text-muted-foreground">Phone</span>
                                <p className="font-semibold">
                                    {userAccount?.phone || "—"}
                                </p>
                            </div>

                            <div>
                                <span className="text-muted-foreground">Email</span>
                                <p className="font-semibold">
                                    {userAccount?.email || "—"}
                                </p>
                            </div>

                            <div>
                                <span className="text-muted-foreground">Address</span>
                                <p className="font-semibold">
                                    {userAccount?.location || "—"}
                                </p>
                            </div>
                        </div>
                    </div>
                )}


                {/* User Details Form */}
                {(!userExists && userAccount2) && (
                    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-2 mb-3">
                            <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            <h4 className="font-medium text-gray-900 dark:text-white">
                                Customer Information
                            </h4>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={userAccount2?.name || ''}
                                    onChange={(e) =>
                                        setUserAccount2({ ...userAccount2, name: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter customer's full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={userAccount2?.email || ''}
                                    onChange={(e) =>
                                        setUserAccount2({ ...userAccount2, email: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter email address"
                                />
                            </div>

                            {/* New Fields */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Gender
                                    </label>
                                    <select
                                        value={userAccount2?.gender || ""}
                                        onChange={(e) =>
                                            setUserAccount2({ ...userAccount2, gender: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Location
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        id="location"
                                        name="location"
                                        value={userAccount2?.location || ''}
                                        onChange={(e) => setUserAccount2({ ...userAccount2, location: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Location</option>
                                        {zambianTowns.map((town, index) => (
                                            <option key={index} value={town}>{town}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="flex justify-center mb-3">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Payment Confirmation
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Review the payment information before proceeding.
                </p>
            </div>

            {/* Transaction Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-3">
                    <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">Transaction Summary</h4>
                </div>

                <div className="space-y-3">
                    {userAccount && (
                        <>
                            <div className="grid  text-gray-900 dark:text-white text grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Name</span>
                                    <p className="font-semibold">
                                        {userAccount?.name || "—"}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-muted-foreground">Phone</span>
                                    <p className="font-semibold">
                                        {userAccount?.phone || "—"}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-muted-foreground">Email</span>
                                    <p className="font-semibold">
                                        {userAccount?.email || "—"}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-muted-foreground">Address</span>
                                    <p className="font-semibold">
                                        {userAccount?.location || "—"}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {userAccount2 && (
                        <>
                            <div className="grid  text-gray-900 dark:text-white text grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Name</span>
                                    <p className="font-semibold">
                                        {userAccount2?.name || "—"}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-muted-foreground">Phone</span>
                                    <p className="font-semibold">
                                        {userAccount2?.phone || "—"}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-muted-foreground">Email</span>
                                    <p className="font-semibold">
                                        {userAccount2?.email || "—"}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-muted-foreground">Address</span>
                                    <p className="font-semibold">
                                        {userAccount2?.location || "—"}
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Success Notice */}
            <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-xl p-4">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-1">
                        Ready to Process
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-200">
                        Customer account is {userExists ? 'verified' : 'created'} and ready for payment processing.
                    </p>
                </div>
            </div>
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return renderStep2();
            case 2:
                return renderStep3();
            default:
                return null;
        }
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1:
                return 'Customer Account';
            case 2:
                return 'Payment Confirmation';
            default:
                return '';
        }
    };

    const getStepIcon = () => {
        switch (currentStep) {
            case 1:
                return <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
            case 2:
                return <CreditCard className="w-5 h-5 text-green-600 dark:text-green-400" />;
            default:
                return null;
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return (userAccount && userAccount.name && userAccount.phone && userAccount.location && userAccount.email) || (userAccount2 && userAccount2.name && userAccount2.phone && userAccount2.location && userAccount2.email);
            case 2:
                return true;
            default:
                return false;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full animate-scaleIn">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            {getStepIcon()}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {getStepTitle()}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Step {currentStep} of 2
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-50 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {renderStepContent()}
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    {currentStep > 1 && (
                        <button
                            onClick={() => setCurrentStep(currentStep - 1)}
                            disabled={isLoading}
                            className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (currentStep === 2) {
                                handleComplete();
                            } else if (currentStep === 1) {
                                handleStep2Continue();
                            }
                        }}
                        disabled={!canProceed() || isLoading}
                        className={`${currentStep > 1 ? 'flex-1' : 'w-full'} py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                    >
                        {isLoading || isLoadingHere ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Processing...
                            </>
                        ) : currentStep === 2 ? (
                            <>
                                <CreditCard className="w-4 h-4" />
                                Confirm Payment
                            </>
                        ) : (
                            <>
                                <ArrowRight className="w-4 h-4" />
                                Continue
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};