import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, Heart } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { CartDrawer } from './CartDrawer';

const announcements = [
  'Subscribe for 10% off',
  'Free shipping for orders above £100',
  'Complimentary gift wrapping available at Checkout',
];

const menuData = {
  'Shop': {
    links: [
      { label: 'Rings', href: '/store?category=rings' },
      { label: 'Necklaces', href: '/store?category=necklaces' },
      { label: 'Earrings', href: '/store?category=earrings' },
      { label: 'Bracelets', href: '/store?category=bracelets' },
      { label: 'Watches', href: '/store?category=watches' },
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1605100804763-ebea23ea3138?w=800&auto=format&fit=crop&q=80', label: 'Rings', href: '/store?category=rings' },
      { src: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80', label: 'Earrings', href: '/store?category=earrings' },
    ]
  },
  'New in': {
    links: [
      { label: "This Week's Arrivals", href: '/store?filter=new' },
      { label: 'Spring Collection', href: '/store?collection=spring' },
      { label: 'Featured Designers', href: '/store?filter=featured' },
      { label: 'Limited Edition', href: '/store?filter=limited' },
      { label: 'Pre-Orders', href: '/store?filter=preorder' },
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&auto=format&fit=crop&q=80', label: 'Arcus Bracelet', href: '/store?product=arcus' },
      { src: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=800&auto=format&fit=crop&q=80', label: 'Spin Bracelet', href: '/store?product=spin' },
    ]
  },
  'About': {
    links: [
      { label: 'Our Story', href: '/about' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Size Guide', href: '/size-guide' },
      { label: 'Customer Care', href: '/contact' },
      { label: 'Store Locator', href: '/stores' },
    ],
    images: [
      { src: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1200&auto=format&fit=crop&q=80', label: 'Read our story', href: '/about' },
    ]
  }
};

export function StoreNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
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
    { label: 'Shop', href: '/store' },
    { label: 'New in', href: '/store?filter=new' },
    { label: 'About', href: '/about' },
  ];

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
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <header
        className="sticky top-0 z-50 bg-[#f5f1ed] border-b border-[#e0dbd5]"
        onMouseLeave={() => setHoveredLink(null)}
      >
        <nav className="w-full px-6 py-4">
          {/* Desktop Layout - 3 Column Grid */}
          <div className="hidden md:grid md:grid-cols-3 items-center gap-4">
            {/* Left: Navigation Links */}
            <div className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`text-sm tracking-wide transition-colors font-sans font-medium py-2 ${hoveredLink === link.label ? 'text-gray-900 border-b border-gray-900' : 'text-gray-800 hover:text-gray-600'
                    }`}
                  onMouseEnter={() => setHoveredLink(link.label)}
                >
                  {link.label}
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
            <div className="flex items-center justify-end gap-6">
              {/* Search Icon */}
              <button
                className="text-gray-800 hover:text-gray-600 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Wishlist Heart Icon */}
              <button
                className="text-gray-800 hover:text-gray-600 transition-colors"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </button>

              {/* Cart */}
              <CartDrawer />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden flex items-center justify-between relative h-12">
            {/* Left: Mobile Menu Button */}
            <button
              className="text-gray-800 p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Center: Logo */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link to="/" className="flex-shrink-0">
                <img
                  src="/logo5.png"
                  alt="Remsleep"
                  className="h-8 w-auto"
                />
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button
                className="text-gray-800 hover:text-gray-600 transition-colors"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              <CartDrawer />
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 border-t border-gray-200 mt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block py-3 text-sm text-gray-800 hover:text-gray-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </nav>

        {/* Mega Menu Overlay */}
        <div
          className={`absolute top-full left-0 w-full bg-[#f5f1ed] border-b border-[#e0dbd5] overflow-hidden transition-all duration-300 ease-in-out ${hoveredLink ? 'max-h-[600px] opacity-100 shadow-sm' : 'max-h-0 opacity-0'
            }`}
        >
          {hoveredLink && menuData[hoveredLink as keyof typeof menuData] && (
            <div className="px-6 pb-12 pt-6">
              <div className="grid grid-cols-12 gap-8">
                {/* Left Links Column */}
                <div className="col-span-3">
                  <ul className="space-y-6">
                    {menuData[hoveredLink as keyof typeof menuData].links.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.href}
                          className="text-sm text-gray-600 hover:text-gray-900 transition-colors font-sans"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Images Column */}
                <div className="col-span-9 flex gap-6 justify-end items-start">
                  {menuData[hoveredLink as keyof typeof menuData].images.map((image, idx) => (
                    <Link key={idx} to={image.href} className="group relative block">
                      <div className={`overflow-hidden relative ${menuData[hoveredLink as keyof typeof menuData].images.length === 1 ? 'h-[220px] w-auto aspect-[16/9]' : 'h-[220px] w-auto aspect-[4/5]'}`}>
                        <img
                          src={image.src}
                          alt={image.label}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                      </div>
                      <div className="mt-3 flex items-center text-sm font-medium text-gray-900">
                        {image.label} <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
