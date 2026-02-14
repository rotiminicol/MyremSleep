import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Heart, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';
import { FavoritesDrawer } from './FavoritesDrawer';
import { CartDrawer } from './CartDrawer';
import { AccountDrawer } from './AccountDrawer';

const announcements = [
  'Subscribe for 10% off',
  'Free shipping for orders above £100',
];

const menuData = {
  'Shop': {
    links: [
      { label: 'Midnight Silk Pillowcase', href: '/product/midnight-silk-pillowcase' },
      { label: 'Linen Duvet Set - Grounding Clay', href: '/product/linen-duvet-set-clay' },
      { label: 'Bamboo Sheet Set - Pebble Grey', href: '/product/bamboo-sheet-set-grey' },
      { label: 'Weighted Sleep Mask', href: '/product/weighted-sleep-mask-indigo' },
      { label: 'Cotton Quilt - Sandstone', href: '/product/cotton-quilt-sandstone' },
    ],
    images: [
      { src: '/image2.png', label: 'Midnight Silk Pillowcase', href: '/product/midnight-silk-pillowcase' },
      { src: '/image3.png', label: 'Linen Duvet Set', href: '/product/linen-duvet-set-clay' },
    ]
  },
  'New in': {
    links: [
      { label: "Latest Arrivals", href: '/new-in#latest-arrivals' },
      { label: 'Seasonal Collection', href: '/new-in#seasonal-collection' },
      { label: 'Featured Sets', href: '/new-in#featured-sets' },
      { label: 'Best Sellers', href: '/new-in#best-sellers' },
      { label: 'Limited Edition', href: '/new-in#limited-edition' },
    ],
    images: [
      { src: '/image4.png', label: 'Summer Sets', href: '/new-in#seasonal-collection' },
      { src: '/image5.png', label: 'Bamboo Blend', href: '/shop' },
    ]
  },
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
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

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

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideOnScroll, lastScrollY]);

  const navLinks = [
    { label: 'Shop', href: '/shop' },
    { label: 'New in', href: '/new-in' },
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
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

  return (
    <>
      {/* Announcement Bar */}
      {announcementVisible && (
        <div className="bg-[#f5f1ed] border-b border-[#e0dbd5] py-2.5 px-2 flex items-center justify-between">
          <p className="text-sm text-gray-700 tracking-wide transition-opacity duration-300 font-sans font-medium">
            {announcements[currentAnnouncement]}
          </p>
          <button
            onClick={() => setAnnouncementVisible(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
            aria-label="Close announcement"
          >
            <img src="/cancel.png" alt="Close" className="h-4 w-4 object-contain" />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="sticky top-0 z-50 bg-[#f5f1ed] border-b border-[#e0dbd5]"
        onMouseLeave={() => setHoveredLink(null)}
      >
        <nav className="w-full px-6 py-4">
          {/* Desktop Layout - 3 Column Grid */}
          <div className="hidden md:grid md:grid-cols-3 items-center gap-4">
            {/* Left: Navigation Links */}
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm tracking-wide transition-colors font-sans font-medium py-2 relative group ${hoveredLink === link.label ? 'text-gray-900' : 'text-gray-800 hover:text-gray-600'
                    }`}
                  onMouseEnter={() => setHoveredLink(link.label)}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-gray-900 transition-transform duration-300 origin-left ${hoveredLink === link.label ? 'scale-x-100' : 'scale-x-0'}`} />
                </Link>
              ))}
            </div>

            {/* Center: Logo */}
            <div className="flex justify-center">
              <Link to="/" className="flex-shrink-0">
                <img
                  src="/logo5.png"
                  alt="Remsleep"
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Right: Search, Wishlist, Cart */}
            <div className="flex items-center justify-end gap-5">
              {/* Search Icon */}
              <button
                onClick={handleSearchToggle}
                className="text-gray-800 hover:text-gray-600 transition-colors"
                aria-label="Search"
              >
                <img src="/search.png" alt="Search" className="h-5 w-5 object-contain" />
              </button>

              {/* Favorites Drawer */}
              <FavoritesDrawer />

              {/* Cart Drawer */}
              <CartDrawer />

              {/* Account Drawer */}
              <AccountDrawer />
            </div>
          </div>

          {/* Mobile Layout (Trigger) */}
          {!mobileMenuOpen && (
            <div className="md:hidden flex items-center justify-between relative h-12">
              <div className="flex items-center gap-3">
                <button
                  className="text-gray-800 p-2"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <img src="/menu-button.png" alt="Menu" className="h-5 w-5 object-contain" />
                </button>
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-800 p-2"
                >
                  <img src="/search.png" alt="Search" className="h-5 w-5 object-contain" />
                </button>
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link to="/" className="flex-shrink-0">
                  <img src="/logo5.png" alt="Remsleep" className="h-8 w-auto" />
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <CartDrawer />
                <AccountDrawer />
              </div>
            </div>
          )}

          {/* Mobile Navigation Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: '-100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
                className="fixed inset-0 z-[60] bg-[#f5f1ed] md:hidden flex flex-col"
              >
                {/* Mobile Header Inside Menu */}
                <div className="flex items-center justify-between px-6 h-12 border-b border-[#e0dbd5] bg-[#f5f1ed] relative">
                  <div className="flex items-center gap-1 -ml-4">
                    <button onClick={() => setMobileMenuOpen(false)} className="p-2">
                      <img src="/cancel.png" alt="Close" className="h-6 w-6 object-contain" />
                    </button>
                    <button
                      onClick={() => {
                        setIsSearchOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="p-2 text-gray-800"
                    >
                      <img src="/search.png" alt="Search" className="h-6 w-6 object-contain" />
                    </button>
                  </div>

                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                      <img src="/logo5.png" alt="Remsleep" className="h-8 w-auto" />
                    </Link>
                  </div>

                  <div className="flex items-center gap-1 -mr-4">
                    <CartDrawer />
                    <AccountDrawer />
                  </div>
                </div>

                {/* Menu Content */}
                <div className="flex-1 overflow-y-auto px-6 py-10">
                  <div className="space-y-12">
                    {navLinks.map((link) => (
                      <div key={link.label} className="space-y-6">
                        <Link
                          to={link.href}
                          className="text-lg font-medium text-gray-900 block tracking-tight uppercase"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                        {menuData[link.label as keyof typeof menuData] && (
                          <div className="pl-6 space-y-4">
                            {menuData[link.label as keyof typeof menuData].links.map((subLink) => (
                              <Link
                                key={subLink.label}
                                to={subLink.href}
                                className="text-sm text-gray-500 hover:text-gray-900 block transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {subLink.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>

        {/* Mega Menu Overlay */}
        <div
          className={`absolute top-full left-0 w-full bg-[#f5f1ed] border-b border-[#e0dbd5] overflow-hidden transition-all duration-300 ease-in-out ${hoveredLink && !isSearchOpen ? 'max-h-[600px] opacity-100 shadow-sm' : 'max-h-0 opacity-0'
            }`}
        >
          {hoveredLink && menuData[hoveredLink as keyof typeof menuData] && (
            <div className="px-6 pb-12 pt-6">
              <div className="grid grid-cols-12 gap-8 items-center">
                {/* Left Links Column */}
                <div className="col-span-4">
                  <ul className="space-y-4">
                    {menuData[hoveredLink as keyof typeof menuData].links.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.href}
                          className="text-lg text-gray-600 hover:text-gray-900 transition-colors font-sans whitespace-nowrap"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Images Column */}
                <div className="col-span-8 flex gap-10 justify-end items-start">
                  {menuData[hoveredLink as keyof typeof menuData].images.map((image, idx) => (
                    <Link key={idx} to={image.href} className="group relative block flex-1 max-w-[450px]">
                      <div className={`overflow-hidden relative ${menuData[hoveredLink as keyof typeof menuData].images.length === 1 ? 'h-[200px] w-full aspect-[16/9]' : 'h-[200px] w-full aspect-square'}`}>
                        <img
                          src={image.src}
                          alt={image.label}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                      </div>
                      <div className="mt-4 flex items-center text-sm font-medium text-gray-900">
                        {image.label} <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

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

                  {/* Popular Searches */}
                  <div>
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">
                      Popular Searches
                    </h3>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {popularSearches.map((tag) => (
                        <button
                          key={tag}
                          className="px-6 py-2.5 rounded-full border border-[#e0dbd5] bg-white/50 text-xs font-medium text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
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
