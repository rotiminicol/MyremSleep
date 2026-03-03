import { useState } from 'react';
import { User, X, Mail, Lock, ArrowRight, Package, Settings, LogOut, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

export function AccountDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'home' | 'login' | 'signup' | 'profile'>('home');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    // Mock state for demonstration
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const validatePassword = (password: string) => {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        const failedRequirements = Object.entries(requirements)
            .filter(([_, passed]) => !passed)
            .map(([requirement]) => {
                switch(requirement) {
                    case 'length': return 'At least 8 characters';
                    case 'uppercase': return 'One uppercase letter';
                    case 'lowercase': return 'One lowercase letter';
                    case 'number': return 'One number';
                    case 'special': return 'One special character';
                    default: return '';
                }
            });
        
        return failedRequirements;
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (view === 'signup' && !formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else {
            const passwordErrors = validatePassword(formData.password);
            if (passwordErrors.length > 0) {
                newErrors.password = passwordErrors.join(', ');
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoggedIn(true);
            setView('profile');
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setView('home');
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button
                    className="text-gray-800 hover:text-gray-600 transition-colors"
                    aria-label="Account"
                >
                    <img src="/people (1).png" alt="Account" className="h-5 w-5 object-contain" />
                </button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className={`bg-[#f5f1ed] p-0 gap-0 border-zinc-200 h-full flex flex-col overflow-hidden ${isMobile
                    ? "w-full border-l shadow-2xl"
                    : "w-full sm:max-w-md border-l"
                    }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
                <SheetHeader className="sticky top-0 z-30 flex-shrink-0 px-6 py-6 border-b border-[#e0dbd5] bg-[#f5f1ed]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {view !== 'home' && (
                                <button
                                    onClick={() => setView('home')}
                                    className="p-1 -ml-2 text-gray-400 hover:text-gray-900 transition-colors"
                                >
                                    <ChevronRight className="h-5 w-5 rotate-180" strokeWidth={1.5} />
                                </button>
                            )}
                            <SheetTitle className="text-sm font-bold tracking-[0.2em] uppercase text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {view === 'profile' ? 'My Account' : (view === 'login' ? 'Log In' : (view === 'signup' ? 'Sign Up' : 'Account'))}
                            </SheetTitle>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <img src="/cancel.png" alt="Close" className="h-5 w-5 object-contain" />
                        </button>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 py-8">
                    <AnimatePresence mode="wait">
                        {view === 'home' && (
                            <motion.div
                                key="home"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-10"
                            >
                                <div className="space-y-6">
                                    <p className="text-[14px] leading-relaxed text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                        Login or create an account to view your order history and manage your account preferences.
                                    </p>

                                    <div className="space-y-3">
                                        <Button
                                            onClick={() => setView('login')}
                                            className="w-full h-14 bg-[#2D2D2D] hover:bg-black text-white rounded-none text-xs font-bold tracking-[0.2em] uppercase transition-all"
                                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                                        >
                                            Log In
                                        </Button>
                                        <Button
                                            onClick={() => setView('signup')}
                                            className="w-full h-14 bg-[#2D2D2D] hover:bg-black text-white rounded-none text-xs font-bold tracking-[0.2em] uppercase transition-all"
                                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                                        >
                                            Create Account
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.15em]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                        Your Account
                                    </h3>

                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => {
                                                setIsOpen(false);
                                                navigate('/orders');
                                            }}
                                            className="w-full flex items-center justify-center gap-3 h-16 bg-[#F8F5F2] hover:bg-[#EBE7E0] border border-[#e0dbd5] transition-colors group"
                                        >
                                            <Package className="h-5 w-5 text-gray-700" strokeWidth={1.5} />
                                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Orders</span>
                                        </button>

                                        <button 
                                            onClick={() => {
                                                setIsOpen(false);
                                                navigate('/profile');
                                            }}
                                            className="w-full flex items-center justify-center gap-3 h-16 bg-[#F8F5F2] hover:bg-[#EBE7E0] border border-[#e0dbd5] transition-colors group"
                                        >
                                            <User className="h-5 w-5 text-gray-700" strokeWidth={1.5} />
                                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Profile</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {(view === 'login' || view === 'signup') && (
                            <motion.div
                                key={view}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-2xl text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                        {view === 'login' ? 'Welcome back' : 'Join REMsleep'}
                                    </h3>
                                    <p className="text-sm text-gray-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                        {view === 'login'
                                            ? 'Sign in to access your orders and profile.'
                                            : 'Create an account for a better sleep ritual.'}
                                    </p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-6">
                                    <div className="space-y-4">
                                        {view === 'signup' && (
                                            <div className="relative">
                                                <Input
                                                    value={formData.fullName}
                                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                                    placeholder="Full Name"
                                                    className={`pl-10 h-14 bg-white border-zinc-200 rounded-none focus:ring-zinc-900 text-sm ${errors.fullName ? 'border-red-500' : ''}`}
                                                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                                                />
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                {errors.fullName && (
                                                    <p className="absolute -bottom-5 left-0 text-xs text-red-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.fullName}</p>
                                                )}
                                            </div>
                                        )}
                                        <div className="relative">
                                            <Input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                placeholder="Email Address"
                                                className={`pl-10 h-14 bg-white border-zinc-200 rounded-none focus:ring-zinc-900 text-sm ${errors.email ? 'border-red-500' : ''}`}
                                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                                                required
                                            />
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            {errors.email && (
                                                <p className="absolute -bottom-5 left-0 text-xs text-red-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.email}</p>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                value={formData.password}
                                                onChange={(e) => handleInputChange('password', e.target.value)}
                                                placeholder="Password"
                                                className={`pl-10 pr-10 h-14 bg-white border-zinc-200 rounded-none focus:ring-zinc-900 text-sm ${errors.password ? 'border-red-500' : ''}`}
                                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                                                required
                                            />
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                            {errors.password && (
                                                <p className="absolute -bottom-5 left-0 text-xs text-red-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>{errors.password}</p>
                                            )}
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-14 bg-[#2D2D2D] hover:bg-black text-white rounded-none text-xs font-bold tracking-[0.2em] uppercase transition-all"
                                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                                    >
                                        {view === 'login' ? 'Log In' : 'Create Account'}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </form>
                            </motion.div>
                        )}

                        {view === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-10"
                            >
                                <div className="flex items-center gap-4 p-6 bg-white border border-zinc-200">
                                    <div className="h-16 w-16 bg-zinc-100 flex items-center justify-center border border-zinc-200">
                                        <User className="h-8 w-8 text-zinc-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Alex Remsleep</h4>
                                        <p className="text-xs text-gray-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>alex@example.com</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <nav className="space-y-1">
                                        <button className="w-full flex items-center justify-between p-4 hover:bg-white transition-all group border-b border-zinc-100">
                                            <div className="flex items-center gap-4">
                                                <Package className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
                                                <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>My Orders</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                        </button>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-between p-4 hover:bg-white transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <LogOut className="h-5 w-5 text-red-600" strokeWidth={1.5} />
                                                <span className="text-sm font-medium text-red-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>Sign Out</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-red-300 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </nav>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="p-6 border-t border-[#e0dbd5] bg-[#f5f1ed]">
                    <p className="text-[9px] text-center text-gray-400 uppercase tracking-widest leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Secure checkout powered by Shopify.
                        <br />
                        © 2026 REMsleep.
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}