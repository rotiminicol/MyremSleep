import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { Package, Calendar, Truck, Check, X, ArrowRight, ChevronDown, Search, MapPin, Clock, Star, RotateCcw, ExternalLink, Sparkles } from 'lucide-react';
import { SimpleBackButton } from '../components/SimpleBackButton';
import { useOrderStore } from '@/stores/orderStore';
import { useCurrency } from '@/hooks/useCurrency';

// ── 3D Tilt Card ──────────────────────────────────────────────────────────
function TiltCard({ children, className = '', intensity = 1, glare = true }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6 * intensity, -6 * intensity]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7 * intensity, 7 * intensity]), { stiffness: 120, damping: 20 });
  
  // Store as percentage strings directly (no multiplication needed)
  const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%']);

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
    y.set((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { x.set(0); y.set(0); setIsHovered(false); }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: '1200px' }}
      className={`relative ${className}`}
    >
      {children}
      {glare && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            mixBlendMode: 'overlay',
          }}
        />
      )}
    </motion.div>
  );
}

// ── Floating Orb ──────────────────────────────────────────────────────────
function FloatingOrb({ className, delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[80px] opacity-20 pointer-events-none ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        x: [0, 30, 0],
        y: [0, -20, 0],
      }}
      transition={{ duration: 12 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

// ── Status Config ─────────────────────────────────────────────────────────
const STATUS = {
  processing: {
    label: 'Processing',
    color: 'from-blue-500/20 to-blue-400/10',
    border: 'border-blue-200/60',
    text: 'text-blue-700',
    dot: 'bg-blue-500',
    icon: Clock,
    glow: 'shadow-blue-500/10',
    timeline: 1,
  },
  shipped: {
    label: 'Shipped',
    color: 'from-amber-500/20 to-orange-400/10',
    border: 'border-amber-200/60',
    text: 'text-amber-700',
    dot: 'bg-amber-500',
    icon: Truck,
    glow: 'shadow-amber-500/10',
    timeline: 2,
  },
  delivered: {
    label: 'Delivered',
    color: 'from-emerald-500/20 to-green-400/10',
    border: 'border-emerald-200/60',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    icon: Check,
    glow: 'shadow-emerald-500/15',
    timeline: 3,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'from-red-500/20 to-rose-400/10',
    border: 'border-red-200/60',
    text: 'text-red-700',
    dot: 'bg-red-400',
    icon: X,
    glow: 'shadow-red-500/10',
    timeline: 0,
  },
};

// ── Timeline Steps ─────────────────────────────────────────────────────────
function OrderTimeline({ status }) {
  const steps = [
    { label: 'Order Placed', icon: Package },
    { label: 'Processing', icon: Clock },
    { label: 'Shipped', icon: Truck },
    { label: 'Delivered', icon: Check },
  ];
  const activeStep = STATUS[status].timeline;

  return (
    <div className="relative flex items-center justify-between px-2 py-6">
      {/* Track line */}
      <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-px bg-[#e8e3dc]" />
      <motion.div
        className="absolute left-6 top-1/2 -translate-y-1/2 h-px bg-gray-900 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: activeStep === 0 ? 0 : Math.min((activeStep - 1) / 3, 1) }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: 'calc(100% - 3rem)' }}
      />

      {steps.map((step, i) => {
        const Icon = step.icon;
        const done = i < activeStep;
        const active = i === activeStep - 1;
        return (
          <div key={i} className="relative z-10 flex flex-col items-center gap-2">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                done ? 'bg-gray-900 border-gray-900' :
                active ? 'bg-white border-gray-900 shadow-lg' :
                'bg-white border-[#e8e3dc]'
              }`}
            >
              <Icon className={`w-4 h-4 ${done ? 'text-white' : active ? 'text-gray-900' : 'text-gray-300'}`} />
              {active && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-gray-900"
                  animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
            <span className={`text-[10px] font-medium tracking-wide whitespace-nowrap hidden sm:block ${done || active ? 'text-gray-700' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Order Card ─────────────────────────────────────────────────────────────
function OrderCard({ order, index, onClick, formatPrice }) {
  const cfg = STATUS[order.status];
  const StatusIcon = cfg.icon;
  
  // Get first item for display
  const firstItem = order.items[0];
  const productTitle = firstItem?.productTitle || 'Product';
  const productImage = firstItem?.image || '/placeholder.png';
  const itemCount = order.items.length;

  return (
    <TiltCard intensity={0.4} className="cursor-pointer group" glare={true}>
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
        onClick={onClick}
        className={`relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-lg border shadow-sm hover:shadow-xl transition-all duration-500 ${cfg.border} ${cfg.glow}`}
      >
        {/* Status gradient wash */}
        <div className={`absolute inset-0 bg-gradient-to-br ${cfg.color} opacity-40 pointer-events-none`} />

        <div className="relative p-6 flex items-center gap-6">
          {/* Product image */}
          <motion.div
            className="w-20 h-20 rounded-xl overflow-hidden bg-[#e8e3dc] flex-shrink-0 shadow-inner"
            style={{ transformStyle: 'preserve-3d', transform: 'translateZ(8px)' }}
            whileHover={{ scale: 1.05 }}
          >
            <img src={productImage} alt={productTitle} className="w-full h-full object-cover" />
          </motion.div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1.5">
              <p className="font-serif text-gray-900 text-[15px] font-medium">{order.id}</p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.3 + index * 0.1 }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${cfg.text} bg-white/70 border ${cfg.border}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </motion.div>
            </div>
            <p className="text-sm text-gray-600 mb-1 truncate">{productTitle}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            </div>
          </div>

          {/* Price + arrow */}
          <div className="flex flex-col items-end gap-3 flex-shrink-0">
            <p className="text-xl font-serif text-gray-900">{formatPrice(order.total)}</p>
            <motion.div
              className="w-8 h-8 rounded-full bg-[#f0ece7] flex items-center justify-center group-hover:bg-gray-900 transition-colors duration-300"
              whileHover={{ scale: 1.1 }}
            >
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors duration-300" />
            </motion.div>
          </div>
        </div>

        {/* Bottom shimmer line */}
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-gray-900/20 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileHover={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </TiltCard>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────
function OrderModal({ order, onClose, formatPrice }) {
  const cfg = STATUS[order.status];
  const StatusIcon = cfg.icon;
  
  // Get first item for display
  const firstItem = order.items[0];
  const productTitle = firstItem?.productTitle || 'Product';
  const productImage = firstItem?.image || '/placeholder.png';

  useEffect(() => {
    const fn = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[#faf9f7] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/80"
        onClick={(e) => e.stopPropagation()}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Header image strip */}
        <div className="relative h-44 rounded-t-3xl overflow-hidden">
          <img src={productImage} alt={productTitle} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <p className="text-white/70 text-xs tracking-[0.3em] uppercase mb-1">Order</p>
            <p className="text-white text-2xl font-serif">{order.id}</p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-[#8f877d] mb-3 font-medium">Status</p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold tracking-wide ${cfg.text} bg-white/70 border ${cfg.border}`}
              >
                <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </motion.div>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 px-4">
              <OrderTimeline status={order.status} />
            </div>
          </div>

          {/* Details grid */}
          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#8f877d] mb-3 font-medium">Order Details</p>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 p-5 space-y-4">
              {[
                { label: 'Product', value: productTitle },
                { label: 'Order Date', value: new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Items', value: `${order.items.length} ${order.items.length === 1 ? 'item' : 'items'}` },
                { label: 'Total', value: formatPrice(order.total), bold: true },
                { label: 'Subtotal', value: formatPrice(order.subtotal) },
                { label: 'Shipping', value: order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost) },
                ...(order.tracking ? [{ label: 'Tracking', value: order.tracking, mono: true }] : []),
              ].map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="flex justify-between items-center text-sm border-b border-[#ede9e4] pb-4 last:border-0 last:pb-0"
                >
                  <span className="text-gray-500">{row.label}</span>
                  <span className={`${row.bold ? 'text-gray-900 font-serif text-base' : 'text-gray-800'} ${row.mono ? 'font-mono text-xs' : ''}`}>{row.value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
              className="flex-1 py-3.5 bg-gray-900 text-white rounded-xl text-sm font-medium tracking-[0.1em] uppercase hover:bg-black transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" /> View Invoice
            </motion.button>
            {order.status === 'delivered' && (
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
                className="flex-1 py-3.5 border border-[#d8d1c8] rounded-xl text-sm font-medium tracking-[0.1em] uppercase hover:bg-[#f0ece7] transition-colors flex items-center justify-center gap-2 text-gray-700"
              >
                <RotateCcw className="w-4 h-4" /> Return
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const { orders } = useOrderStore();
  const { formatPrice } = useCurrency();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -30]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.productTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: Package },
    { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: Check },
    { label: 'Total Spent', value: formatPrice(orders.reduce((s, o) => s + o.total, 0)), icon: Star },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f5f1ed] overflow-x-hidden" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FloatingOrb className="top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#d4ccc3]" delay={0} />
        <FloatingOrb className="bottom-0 right-0 w-[400px] h-[400px] bg-[#c8c0b7]" delay={4} />
        <FloatingOrb className="top-1/2 left-1/3 w-[300px] h-[300px] bg-[#e0dbd5]" delay={8} />
      </div>
      
      <SimpleBackButton />

      <main className="relative z-10 max-w-[960px] mx-auto px-1 md:px-2 pt-16 pb-24">

        {/* Header */}
        <motion.div style={{ y: headerY }} className="mb-12">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <span className="text-[10px] tracking-[0.5em] text-[#8f877d] block mb-3 uppercase font-medium">My Account</span>
            <h1 className="text-[clamp(42px,6vw,80px)] font-serif text-gray-900 leading-none tracking-tight mb-4">
              Your Orders
            </h1>
            <p className="text-base text-gray-500 max-w-md">
              Track shipments, manage returns, and review your complete purchase history.
            </p>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {stats.map((stat, i) => (
            <TiltCard key={i} intensity={0.6} glare={true}>
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white/70 backdrop-blur-lg rounded-2xl p-5 border border-white/80 shadow-sm"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="w-8 h-8 rounded-full bg-[#ece8e2] flex items-center justify-center mb-3"
                  style={{ transform: 'translateZ(6px)' }}>
                  <stat.icon className="w-4 h-4 text-[#8f877d]" />
                </div>
                <p className="text-2xl font-serif text-gray-900 mb-0.5"
                  style={{ transform: 'translateZ(4px)' }}>{stat.value}</p>
                <p className="text-xs text-gray-400 tracking-wide">{stat.label}</p>
              </motion.div>
            </TiltCard>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white/70 backdrop-blur-lg border border-white/80 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8f877d]/30 focus:border-[#8f877d] shadow-sm transition-all"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3.5 bg-white/70 backdrop-blur-lg border border-white/80 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8f877d]/30 shadow-sm transition-all cursor-pointer"
            >
              <option value="all">All orders</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </motion.div>

        {/* Orders list */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredOrders.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Package className="w-16 h-16 text-gray-200 mx-auto mb-5" />
                </motion.div>
                <h3 className="text-xl font-serif text-gray-400 mb-2">No orders found</h3>
                <p className="text-sm text-gray-400">Try adjusting your search or filter.</p>
              </motion.div>
            ) : (
              filteredOrders.map((order, i) => (
                <OrderCard key={order.id} order={order} index={i} onClick={() => setSelectedOrder(order)} formatPrice={formatPrice} />
              ))
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} formatPrice={formatPrice} />}
      </AnimatePresence>
    </div>
  );
}