
import { useState } from 'react';
import { User, X, Mail, Lock, ArrowRight, Package, Settings, LogOut, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
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
    const isMobile = useIsMobile();

    // Mock state for demonstration
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoggedIn(true);
        setView('profile');
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setView('home');
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button
                    className="text-gray-800 hover:text-gray-600 transition-colors p-2"
                    aria-label="Account"
                >
                    <User className="h-5 w-5" />
                </button>
            </SheetTrigger>
            <SheetContent
                side="right"
                className={`bg-[#f5f1ed] p-0 gap-0 border-zinc-200 h-full flex flex-col overflow-hidden ${isMobile
                    ? "w-full border-l shadow-2xl"
                    : "w-full sm:max-w-md border-l"
                    }`}
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
                            <SheetTitle className="text-sm font-bold tracking-[0.2em] uppercase text-gray-900">
                                {view === 'profile' ? 'My Account' : (view === 'login' ? 'Log In' : (view === 'signup' ? 'Sign Up' : 'Account'))}
                            </SheetTitle>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <X className="h-5 w-5" strokeWidth={1.5} />
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
                                    <p className="text-[14px] leading-relaxed text-gray-900 font-sans">
                                        Login or create an account to view your order history and manage your account preferences.
                                    </p>

                                    <div className="space-y-3">
                                        <Button
                                            onClick={() => setView('login')}
                                            className="w-full h-14 bg-[#2D2D2D] hover:bg-black text-white rounded-none text-xs font-bold tracking-[0.2em] uppercase transition-all"
                                        >
                                            Log In
                                        </Button>
                                        <Button
                                            onClick={() => setView('signup')}
                                            className="w-full h-14 bg-[#2D2D2D] hover:bg-black text-white rounded-none text-xs font-bold tracking-[0.2em] uppercase transition-all"
                                        >
                                            Create Account
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-[11px] font-bold text-gray-900 uppercase tracking-[0.15em]">
                                        Your Account
                                    </h3>

                                    <div className="space-y-3">
                                        <button className="w-full flex items-center justify-center gap-3 h-16 bg-[#F8F5F2] hover:bg-[#EBE7E0] border border-[#e0dbd5] transition-colors group">
                                            <Package className="h-5 w-5 text-gray-700" strokeWidth={1.5} />
                                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">Orders</span>
                                        </button>

                                        <button className="w-full flex items-center justify-center gap-3 h-16 bg-[#F8F5F2] hover:bg-[#EBE7E0] border border-[#e0dbd5] transition-colors group">
                                            <User className="h-5 w-5 text-gray-700" strokeWidth={1.5} />
                                            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900">Profile</span>
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
                                    <h3 className="text-2xl font-serif text-gray-900">
                                        {view === 'login' ? 'Welcome back' : 'Join REMsleep'}
                                    </h3>
                                    <p className="text-sm text-gray-500 font-sans">
                                        {view === 'login'
                                            ? 'Sign in to access your orders and profile.'
                                            : 'Create an account for a better sleep ritual.'}
                                    </p>
                                </div>

                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-4">
                                        {view === 'signup' && (
                                            <div className="relative">
                                                <Input
                                                    placeholder="Full Name"
                                                    className="pl-10 h-14 bg-white border-zinc-200 rounded-none focus:ring-zinc-900 text-sm"
                                                />
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="relative">
                                            <Input
                                                type="email"
                                                placeholder="Email Address"
                                                className="pl-10 h-14 bg-white border-zinc-200 rounded-none focus:ring-zinc-900 text-sm"
                                                required
                                            />
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        </div>
                                        <div className="relative">
                                            <Input
                                                type="password"
                                                placeholder="Password"
                                                className="pl-10 h-14 bg-white border-zinc-200 rounded-none focus:ring-zinc-900 text-sm"
                                                required
                                            />
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full h-14 bg-[#2D2D2D] hover:bg-black text-white rounded-none text-xs font-bold tracking-[0.2em] uppercase transition-all"
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
                                        <h4 className="text-lg font-serif text-gray-900">Alex Remsleep</h4>
                                        <p className="text-xs text-gray-500 font-sans">alex@example.com</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <nav className="space-y-1">
                                        <button className="w-full flex items-center justify-between p-4 hover:bg-white transition-all group border-b border-zinc-100">
                                            <div className="flex items-center gap-4">
                                                <Package className="h-5 w-5 text-gray-600" strokeWidth={1.5} />
                                                <span className="text-sm font-medium text-gray-700">My Orders</span>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                        </button>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-between p-4 hover:bg-white transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <LogOut className="h-5 w-5 text-red-600" strokeWidth={1.5} />
                                                <span className="text-sm font-medium text-red-600">Sign Out</span>
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
                    <p className="text-[9px] text-center text-gray-400 uppercase tracking-widest leading-relaxed">
                        Secure checkout powered by Shopify.
                        <br />
                        © 2026 REMsleep.
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
