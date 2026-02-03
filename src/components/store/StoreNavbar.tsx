import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { CartDrawer } from './CartDrawer';

const announcements = [
  'Subscribe for 10% off',
  'Free shipping for orders above 1.000 DKK',
  'Complimentary gift wrapping available at Checkout',
];

export function StoreNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!announcementVisible) return;
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [announcementVisible]);

  const navLinks = [
    { label: 'Shop All', href: '/store' },
    { label: 'Bedding', href: '/store?category=bedding' },
    { label: 'Sleepwear', href: '/store?category=sleepwear' },
    { label: 'Accessories', href: '/store?category=accessories' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      {announcementVisible && (
        <div className="bg-[#f5f1ed] border-b border-[#e0dbd5] py-2.5 px-4 flex items-center justify-between">
          <p className="text-sm text-gray-700 tracking-wide transition-opacity duration-300">
            {announcements[currentAnnouncement]}
          </p>
          <button
            onClick={() => setAnnouncementVisible(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
            aria-label="Close announcement"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-[#f5f1ed] border-b border-[#e0dbd5]">
        <nav className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img
                src="/logo5.png"
                alt="Remsleep"
                className="h-8 md:h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm text-gray-800 hover:text-gray-600 transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button className="hidden md:flex text-gray-800 hover:text-gray-600 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              
              <CartDrawer />

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-800"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 border-t border-[#e0dbd5] mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block py-3 text-sm text-gray-800 hover:text-gray-600 transition-colors tracking-wide"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
