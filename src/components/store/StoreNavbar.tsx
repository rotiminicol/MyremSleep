import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Heart, User, ChevronLeft, ChevronRight, Phone, ShoppingBag, Globe, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserCart } from '@/stores/userCartStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { useCurrencyStore } from '@/stores/currencyStore';
import { useCustomerStore } from '@/stores/customerStore';
import { FavoritesDrawer } from './FavoritesDrawer';
import { CartDrawer } from './CartDrawer';
import { AccountDrawer } from './AccountDrawer';

const announcements = [
  'Sign up for 10% and new letter',
  'Free Shipping over £99',
  'Launch Bundles: duvet cover + fitted sheet + 4 pillowcases.',
  '300 thread count Egyptian cotton sateen bundles.'
];

const menuData = {
  'About': {
    links: [
      { label: 'Our Story', href: '/about' },
      { label: 'Sleep Science', href: '/sleep-science' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Material Guide', href: '/materials' },
      { label: 'Contact Us', href: '/contact' },
    ],
    images: [
      { src: '/image7.png', label: 'Our philosophy', href: '/about' },
    ]
  },
  'Blog': {
    links: [
      { label: 'Sleep Tips', href: '/blog' },
      { label: 'Bedroom Decor', href: '/blog' },
      { label: 'Wellness Journal', href: '/blog' },
      { label: 'Product Care', href: '/blog' },
      { label: 'Sleep Stories', href: '/blog' },
    ],
    images: [
      { src: '/image6.png', label: 'Latest Post: Better Sleep habits', href: '/blog' },
    ]
  }
};

export function StoreNavbar({ hideOnScroll = false }: { hideOnScroll?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Use currency store
  const { selectedCurrency, setSelectedCurrency } = useCurrencyStore();

  // Use customer store
  const { profile, isLoggedIn } = useCustomerStore();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!profile) return '';
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Define currencies array inside the component
  const currencies = [
    { code: 'USD', symbol: '$', flag: 'https://flagcdn.com/w20/us.png', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', flag: 'https://flagcdn.com/w20/eu.png', name: 'Euro' },
    { code: 'GBP', symbol: '£', flag: 'https://flagcdn.com/w20/gb.png', name: 'British Pound' },
    { code: 'JPY', symbol: '¥', flag: 'https://flagcdn.com/w20/jp.png', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', flag: 'https://flagcdn.com/w20/cn.png', name: 'Chinese Yuan' },
    { code: 'AUD', symbol: 'A$', flag: 'https://flagcdn.com/w20/au.png', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', flag: 'https://flagcdn.com/w20/ca.png', name: 'Canadian Dollar' },
    { code: 'CHF', symbol: 'Fr', flag: 'https://flagcdn.com/w20/ch.png', name: 'Swiss Franc' },
    { code: 'INR', symbol: '₹', flag: 'https://flagcdn.com/w20/in.png', name: 'Indian Rupee' },
    { code: 'BRL', symbol: 'R$', flag: 'https://flagcdn.com/w20/br.png', name: 'Brazilian Real' },
    { code: 'RUB', symbol: '₽', flag: 'https://flagcdn.com/w20/ru.png', name: 'Russian Ruble' },
    { code: 'KRW', symbol: '₩', flag: 'https://flagcdn.com/w20/kr.png', name: 'South Korean Won' },
    { code: 'MXN', symbol: '$', flag: 'https://flagcdn.com/w20/mx.png', name: 'Mexican Peso' },
    { code: 'SGD', symbol: 'S$', flag: 'https://flagcdn.com/w20/sg.png', name: 'Singapore Dollar' },
    { code: 'HKD', symbol: 'HK$', flag: 'https://flagcdn.com/w20/hk.png', name: 'Hong Kong Dollar' },
    { code: 'NOK', symbol: 'kr', flag: 'https://flagcdn.com/w20/no.png', name: 'Norwegian Krone' },
    { code: 'NZD', symbol: 'NZ$', flag: 'https://flagcdn.com/w20/nz.png', name: 'New Zealand Dollar' },
    { code: 'ZAR', symbol: 'R', flag: 'https://flagcdn.com/w20/za.png', name: 'South African Rand' },
    { code: 'TRY', symbol: '₺', flag: 'https://flagcdn.com/w20/tr.png', name: 'Turkish Lira' },
    { code: 'SEK', symbol: 'kr', flag: 'https://flagcdn.com/w20/se.png', name: 'Swedish Krona' },
    { code: 'DKK', symbol: 'kr', flag: 'https://flagcdn.com/w20/dk.png', name: 'Danish Krone' },
    { code: 'PLN', symbol: 'zł', flag: 'https://flagcdn.com/w20/pl.png', name: 'Polish Zloty' },
    { code: 'THB', symbol: '฿', flag: 'https://flagcdn.com/w20/th.png', name: 'Thai Baht' },
    { code: 'IDR', symbol: 'Rp', flag: 'https://flagcdn.com/w20/id.png', name: 'Indonesian Rupiah' },
    { code: 'HUF', symbol: 'Ft', flag: 'https://flagcdn.com/w20/hu.png', name: 'Hungarian Forint' },
    { code: 'CZK', symbol: 'Kč', flag: 'https://flagcdn.com/w20/cz.png', name: 'Czech Koruna' },
    { code: 'ILS', symbol: '₪', flag: 'https://flagcdn.com/w20/il.png', name: 'Israeli Shekel' },
    { code: 'CLP', symbol: '$', flag: 'https://flagcdn.com/w20/cl.png', name: 'Chilean Peso' },
    { code: 'PHP', symbol: '₱', flag: 'https://flagcdn.com/w20/ph.png', name: 'Philippine Peso' },
    { code: 'AED', symbol: 'د.إ', flag: 'https://flagcdn.com/w20/ae.png', name: 'UAE Dirham' },
    { code: 'COP', symbol: '$', flag: 'https://flagcdn.com/w20/co.png', name: 'Colombian Peso' },
    { code: 'SAR', symbol: '﷼', flag: 'https://flagcdn.com/w20/sa.png', name: 'Saudi Riyal' },
    { code: 'MYR', symbol: 'RM', flag: 'https://flagcdn.com/w20/my.png', name: 'Malaysian Ringgit' },
    { code: 'RON', symbol: 'lei', flag: 'https://flagcdn.com/w20/ro.png', name: 'Romanian Leu' },
    { code: 'NGN', symbol: '₦', flag: 'https://flagcdn.com/w20/ng.png', name: 'Nigerian Naira' }
  ];

  const userCart = useUserCart();
  const items = userCart.items;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const { items: favoriteItems } = useFavoritesStore();

  // Filter currencies based on search
  const filteredCurrencies = currencies.filter(currency =>
    currency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    currency.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group currencies by region for better organization
  const currencyGroups = {
    'Americas': currencies.filter(c => ['USD', 'CAD', 'MXN', 'BRL', 'ARS', 'CLP', 'COP', 'PEN'].includes(c.code)),
    'Europe': currencies.filter(c => ['EUR', 'GBP', 'CHF', 'NOK', 'SEK', 'DKK', 'PLN', 'HUF', 'CZK', 'RON', 'RUB', 'TRY'].includes(c.code)),
    'Asia Pacific': currencies.filter(c => ['JPY', 'CNY', 'AUD', 'NZD', 'KRW', 'SGD', 'HKD', 'INR', 'IDR', 'MYR', 'THB', 'PHP'].includes(c.code)),
    'Middle East & Africa': currencies.filter(c => ['AED', 'SAR', 'ILS', 'ZAR', 'NGN'].includes(c.code)),
  };

  useEffect(() => {
    if (!announcementVisible) return;
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [announcementVisible]);

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!hideOnScroll) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past threshold - hide
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show
        setIsVisible(true);
      }
      // If currentScrollY === lastScrollY (stationary), we don't change isVisible
      // which means it stays hidden if it was already hidden.

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideOnScroll, lastScrollY]);

  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ];

  const mobileNavLinks = [
    { label: 'Shop Bundle', href: '/product/winter-cloud' },
    { label: 'Favorites', href: '/favorites', isFavorite: true },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policies', href: '/privacy' },
    { label: 'Terms and Condition', href: '/terms' },
  ];

  const popularSearches = [
    'Silk Pillowcase',
    'Linen Duvet',
    'Bamboo Sheets',
    'Weighted Mask',
    'Lavender Eye Pillow',
    'Clay Bedding'
  ];

  const handleSearchToggle = () => {
    setHoveredLink(null);
    setIsSearchOpen(!isSearchOpen);
  };

  const nextAnnouncement = () => {
    setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
  };

  const prevAnnouncement = () => {
    setCurrentAnnouncement((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  return (
    <>
      {/* Announcement Bar */}
      {announcementVisible && (
        <div className="bg-primary text-white py-2 px-4 flex items-center justify-between text-[11px] font-medium tracking-[0.15em] uppercase">
          {/* Left: Empty for centering or carousel controls */}
          <div className="hidden md:flex flex-1"></div>

          {/* Center: Announcement Carousel */}
          <div className="flex items-center justify-between md:justify-center w-full md:w-auto md:gap-32 flex-1 md:flex-initial">
            <button onClick={prevAnnouncement} className="hover:opacity-70 transition-opacity">
              <ChevronLeft className="h-4 w-4 stroke-[1.5]" />
            </button>
            <div className="overflow-hidden min-w-[200px] text-center">
              <motion.p
                key={currentAnnouncement}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="whitespace-nowrap underline underline-offset-4"
              >
                {announcements[currentAnnouncement]}
              </motion.p>
            </div>
            <button onClick={nextAnnouncement} className="hover:opacity-70 transition-opacity">
              <ChevronRight className="h-4 w-4 stroke-[1.5]" />
            </button>
          </div>

          {/* Right: Help Info */}
          <div className="hidden md:flex items-center justify-end gap-2 flex-1 lowercase text-[11px]">
            <Phone className="h-3 w-3" />
            <span>Here to help +44 1242 339 161</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="sticky top-0 z-50 bg-[#f5f1ed] border-b border-[#e0dbd5]"
        onMouseLeave={() => { }}
      >
        <nav className="w-full px-6 py-6 bg-[#f5f1ed]">
          {/* Desktop Layout - 3 Column Grid */}
          <div className="hidden md:grid md:grid-cols-3 items-center">
            {/* Left Column: Empty or Search */}
            <div></div>

            {/* Center Column: Logo */}
            <div className="flex justify-center">
              <Link to="/store" className="flex-shrink-0">
                <img
                  src="/logo5.png"
                  alt="Remsleep"
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Right Column: Icons */}
            <div className="flex items-center justify-end gap-6">
              {/* Currency Selector - Enhanced */}
              <div className="relative">
                <motion.button
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                  className="flex items-center gap-2 cursor-pointer group relative px-2 py-1.5 rounded-lg hover:bg-[#e8e3dc] transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img
                    src={selectedCurrency.flag}
                    alt={selectedCurrency.name}
                    className="w-5 h-auto object-contain rounded-sm shadow-sm"
                  />
                  <span className="text-[11px] font-medium tracking-wider text-gray-600 group-hover:text-gray-900">
                    {selectedCurrency.code} {selectedCurrency.symbol}
                  </span>
                  <motion.div
                    animate={{ rotate: isCurrencyOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-gray-600" />
                  </motion.div>
                </motion.button>

                {/* Currency Dropdown - Enhanced with Search */}
                <AnimatePresence>
                  {isCurrencyOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full right-0 mt-2 w-96 bg-[#f5f1ed] border border-[#d8d1c8] rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-sm"
                    >
                      {/* Header with Search */}
                      <div className="p-4 border-b border-[#d8d1c8]">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-serif text-gray-900">Select Currency</h3>
                          <button
                            onClick={() => setIsCurrencyOpen(false)}
                            className="p-1 hover:bg-[#e8e3dc] rounded-full transition-colors"
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search currency or country..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-[#e8e3dc] border border-[#d8d1c8] rounded-xl text-sm placeholder:text-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* Currency List with Groups - Hidden Scrollbar */}
                      <div className="max-h-96 overflow-y-auto p-2 scrollbar-hide">
                        {searchQuery ? (
                          // Search results
                          <div className="space-y-1">
                            {filteredCurrencies.map((currency) => (
                              <motion.button
                                key={currency.code}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                onClick={() => {
                                  setSelectedCurrency(currency);
                                  setIsCurrencyOpen(false);
                                  setSearchQuery('');
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${selectedCurrency.code === currency.code
                                  ? 'bg-[#e8e3dc] shadow-sm'
                                  : 'hover:bg-[#e8e3dc]'
                                  }`}
                              >
                                <img
                                  src={currency.flag}
                                  alt={currency.name}
                                  className="w-6 h-auto object-contain rounded-sm"
                                />
                                <div className="flex-1 text-left">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-900">{currency.code}</span>
                                    <span className="text-xs text-gray-500">{currency.symbol}</span>
                                  </div>
                                  <div className="text-xs text-gray-500">{currency.name}</div>
                                </div>
                                {selectedCurrency.code === currency.code && (
                                  <Check className="h-4 w-4 text-gray-700" />
                                )}
                              </motion.button>
                            ))}
                            {filteredCurrencies.length === 0 && (
                              <div className="text-center py-8">
                                <Globe className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">No currencies found</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          // Grouped by region
                          Object.entries(currencyGroups).map(([region, regionCurrencies]) => (
                            regionCurrencies.length > 0 && (
                              <div key={region} className="mb-4">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-2">
                                  {region}
                                </h4>
                                <div className="space-y-1">
                                  {regionCurrencies.map((currency) => (
                                    <motion.button
                                      key={currency.code}
                                      whileHover={{ x: 2 }}
                                      onClick={() => {
                                        setSelectedCurrency(currency);
                                        setIsCurrencyOpen(false);
                                      }}
                                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${selectedCurrency.code === currency.code
                                        ? 'bg-[#e8e3dc] shadow-sm'
                                        : 'hover:bg-[#e8e3dc]'
                                        }`}
                                    >
                                      <img
                                        src={currency.flag}
                                        alt={currency.name}
                                        className="w-6 h-auto object-contain rounded-sm"
                                      />
                                      <div className="flex-1 text-left">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium text-gray-900">{currency.code}</span>
                                          <span className="text-xs text-gray-500">{currency.symbol}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">{currency.name}</div>
                                      </div>
                                      {selectedCurrency.code === currency.code && (
                                        <Check className="h-4 w-4 text-gray-700" />
                                      )}
                                    </motion.button>
                                  ))}
                                </div>
                              </div>
                            )
                          ))
                        )}
                      </div>

                      {/* Footer with stats */}
                      <div className="p-3 border-t border-[#d8d1c8] bg-[#e8e3dc]">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>{currencies.length} currencies available</span>
                          <span className="px-2 py-1 bg-[#f5f1ed] rounded-lg">Live exchange rates</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={handleSearchToggle}
                className="hover:opacity-70 transition-opacity"
              >
                <Search className="h-5 w-5 stroke-[1.5]" />
              </button>

              <CartDrawer />
              <AccountDrawer />
            </div>
          </div>

          {/* Navigation Links - Centered Row below logo */}
          <div className="hidden md:flex justify-center mt-8 space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-[11px] font-medium tracking-[0.2em] text-[#1c1c1c] hover:opacity-60 transition-opacity uppercase"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Layout (Trigger) */}
          {!mobileMenuOpen && (
            <div className="md:hidden flex items-center justify-between h-8 px-1">
              {/* Left: Logo */}
              <div className="flex items-center -ml-6">
                <Link to="/store" className="flex-shrink-0">
                  <img src="/logo5.png" alt="Remsleep" className="h-8 w-auto" />
                </Link>
              </div>

              {/* Right: Icons - Removed FavoritesDrawer */}
              <div className="flex items-center gap-5">
                <AccountDrawer />
                <CartDrawer />
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="hover:opacity-70 transition-opacity"
                >
                  <Menu className="h-6 w-6 stroke-[1.5]" />
                </button>
              </div>
            </div>
          )}

          {/* Mobile Navigation Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-[60] bg-[#f5f1ed] md:hidden flex flex-col"
              >
                {/* Mobile Header Inside Menu */}
                <div className="flex items-center px-6 h-16 border-b border-[#e0dbd5]">
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 -ml-2">
                    <X className="h-6 w-6 stroke-[1.5]" />
                  </button>
                </div>

                {/* Menu Content */}
                <div className="flex-1 overflow-y-auto pt-4 pb-20 no-scrollbar">
                  <div className="flex flex-col">
                    {mobileNavLinks.map((link) => (
                      <div key={link.label}>
                        {link.isFavorite ? (
                          <Link
                            to={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="w-full flex items-center justify-between px-8 py-6 text-[13px] font-medium tracking-[0.15em] text-[#1c1c1c] uppercase"
                          >
                            <span>{link.label}</span>
                            {favoriteItems.length > 0 && (
                              <span className="bg-[#2D2D2D] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                                {favoriteItems.length}
                              </span>
                            )}
                          </Link>
                        ) : (
                          <Link
                            to={link.href}
                            className="flex items-center px-8 py-6 text-[13px] font-medium tracking-[0.15em] text-[#1c1c1c] uppercase"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {link.label}
                          </Link>
                        )}
                        <div className="mx-8 border-b border-[#e0dbd5]" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sticky Footer */}
                <div className="mt-auto border-t border-[#e0dbd5] bg-[#f5f1ed] p-8 pb-10">
                  <div className="flex items-center justify-between">
                    {/* Currency Selector - Mobile Enhanced */}
                    <div className="relative">
                      <button
                        onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <img
                          src={selectedCurrency.flag}
                          alt={selectedCurrency.name}
                          className="w-5 h-auto object-contain"
                        />
                        <span className="text-[12px] font-medium tracking-wider text-[#1c1c1c]">
                          {selectedCurrency.code} {selectedCurrency.symbol}
                        </span>
                        <ChevronDown className={`h-3 w-3 text-[#1c1c1c] transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Mobile Currency Dropdown - Enhanced */}
                      <AnimatePresence>
                        {isCurrencyOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-full left-0 mb-2 w-[320px] bg-[#f5f1ed] border border-[#d8d1c8] rounded-2xl shadow-2xl overflow-hidden z-50"
                          >
                            {/* Header with Search */}
                            <div className="p-4 border-b border-[#d8d1c8]">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Search currencies..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="w-full pl-9 pr-4 py-3 bg-[#e8e3dc] border border-[#d8d1c8] rounded-xl text-sm placeholder:text-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
                                />
                              </div>
                            </div>

                            {/* Currency List - Hidden Scrollbar */}
                            <div className="max-h-80 overflow-y-auto p-2 scrollbar-hide">
                              {filteredCurrencies.map((currency) => (
                                <button
                                  key={currency.code}
                                  onClick={() => {
                                    setSelectedCurrency(currency);
                                    setIsCurrencyOpen(false);
                                    setSearchQuery('');
                                  }}
                                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${selectedCurrency.code === currency.code ? 'bg-[#e8e3dc]' : 'hover:bg-[#e8e3dc]'
                                    }`}
                                >
                                  <img
                                    src={currency.flag}
                                    alt={currency.name}
                                    className="w-6 h-auto object-contain"
                                  />
                                  <div className="flex-1 text-left">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-gray-900">{currency.code}</span>
                                      <span className="text-xs text-gray-500">{currency.symbol}</span>
                                    </div>
                                    <div className="text-xs text-gray-500">{currency.name}</div>
                                  </div>
                                  {selectedCurrency.code === currency.code && (
                                    <Check className="h-4 w-4 text-gray-700" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Sign In */}
                    {isLoggedIn() ? (
                      <div className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-[#2D2D2D] text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {getUserInitials()}
                        </div>
                        <span className="text-[12px] font-medium tracking-wider text-[#1c1c1c] uppercase">
                          {profile?.first_name || 'Account'}
                        </span>
                      </div>
                    ) : (
                      <button
                        className="flex items-center gap-2 group"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('openAccountDrawer', { detail: { view: 'login' } }));
                          setMobileMenuOpen(false);
                        }}
                      >
                        <User className="h-5 w-5 text-[#1c1c1c] stroke-[1.5]" />
                        <span className="text-[12px] font-medium tracking-wider text-[#1c1c1c] uppercase">Sign In</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0, scaleY: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-0 w-full z-[45] bg-[#f5f1ed] border-b border-[#e0dbd5] origin-top shadow-xl"
            >
              <div className="max-w-[1400px] mx-auto px-6 py-12 flex justify-center text-center">
                <div className="max-w-3xl w-full">
                  {/* Search Input */}
                  <div className="relative mb-12">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search for ritual essentials..."
                      className="w-full bg-transparent border-b border-gray-300 py-5 text-center text-2xl font-light placeholder:text-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
                    />
                    <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </div>
              {/* Backdrop for closing */}
              <div
                className="absolute top-full left-0 w-full h-screen bg-black/10 backdrop-blur-[2px]"
                onClick={() => setIsSearchOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}