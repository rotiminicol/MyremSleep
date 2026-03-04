import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { Package, Calendar, Truck, Check, X, ArrowRight, ChevronDown, Search, Clock, Star, ExternalLink, Loader2, ShoppingBag } from 'lucide-react';
import { SimpleBackButton } from '../components/SimpleBackButton';
import { useCustomerStore } from '@/stores/customerStore';
import { useOrderStore } from '@/stores/orderStore';
import { useCurrency } from '@/hooks/useCurrency';
import { useNavigate } from 'react-router-dom';

// ── 3D Tilt Card ──────────────────────────────────────────────────────────
function TiltCard({ children, className = '', intensity = 1, glare = true }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6 * intensity, -6 * intensity]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7 * intensity, 7 * intensity]), { stiffness: 120, damping: 20 });
  
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

// ── Status helpers ────────────────────────────────────────────────────────
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
  const activeStep = STATUS[status]?.timeline ?? 0;

  return (
    <div className="relative flex items-center justify-between px-2 py-6">
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

interface LocalOrder {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    productTitle: string;
    quantity: number;
    price: { amount: string; currencyCode: string };
    image?: string;
    selectedOptions: Array<{ name: string; value: string }>;
  }>;
  total: number;
  subtotal: number;
  shippingCost: number;
}

// ── Order Card ─────────────────────────────────────────────────────────────
function OrderCard({ order, index, onClick, formatPrice }: { order: LocalOrder; index: number; onClick: () => void; formatPrice: (n: number) => string }) {
  const status = order.status;
  const cfg = STATUS[status];
  const StatusIcon = cfg.icon;
  
  const firstItem = order.items[0];
  const productTitle = firstItem?.productTitle || 'Product';
  const productImage = firstItem?.image || '/placeholder.svg';
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
        <div className={`absolute inset-0 bg-gradient-to-br ${cfg.color} opacity-40 pointer-events-none`} />

        <div className="relative p-6 flex items-center gap-6">
          <motion.div
            className="w-20 h-20 rounded-xl overflow-hidden bg-[#e8e3dc] flex-shrink-0 shadow-inner"
            style={{ transformStyle: 'preserve-3d', transform: 'translateZ(8px)' }}
            whileHover={{ scale: 1.05 }}
          >
            <img src={productImage} alt={productTitle} className="w-full h-full object-cover" />
          </motion.div>

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
      </motion.div>
    </TiltCard>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────
function OrderModal({ order, onClose, formatPrice }: { order: LocalOrder; onClose: () => void; formatPrice: (n: number) => string }) {
  const status = order.status;
  const cfg = STATUS[status];

  const firstItem = order.items[0];
  const productTitle = firstItem?.productTitle || 'Product';
  const productImage = firstItem?.image || '/placeholder.svg';

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
      >
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
              <OrderTimeline status={status} />
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.25em] uppercase text-[#8f877d] mb-3 font-medium">Order Details</p>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/80 p-5 space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-sm border-b border-[#ede9e4] pb-4">
                  <span className="text-gray-700">{item.productTitle} × {item.quantity}</span>
                  <span className="text-gray-900">{formatPrice(parseFloat(item.price.amount) * item.quantity)}</span>
                </div>
              ))}
              {[
                { label: 'Subtotal', value: formatPrice(order.subtotal) },
                { label: 'Shipping', value: order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost) },
                { label: 'Total', value: formatPrice(order.total), bold: true },
              ].map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  className="flex justify-between items-center text-sm border-b border-[#ede9e4] pb-4 last:border-0 last:pb-0"
                >
                  <span className="text-gray-500">{row.label}</span>
                  <span className={row.bold ? 'text-gray-900 font-serif text-base' : 'text-gray-800'}>{row.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useCustomerStore();
  const { orders: localOrders } = useOrderStore();
  const { formatPrice } = useCurrency();
  const [selectedOrder, setSelectedOrder] = useState<LocalOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -30]);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/store');
    }
  }, []);

  // Map local orders to our display format
  const orders: LocalOrder[] = localOrders.map(o => ({
    id: o.id,
    date: o.date,
    status: o.status,
    items: o.items.map(item => ({
      productTitle: item.productTitle,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
      selectedOptions: item.selectedOptions,
    })),
    total: o.total,
    subtotal: o.subtotal,
    shippingCost: o.shippingCost,
  }));

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
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div className="absolute top-[-80px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[#d4ccc3] blur-[100px] opacity-20"
          animate={{ scale: [1, 1.15, 1], x: [0, -40, 0] }} transition={{ duration: 20, repeat: Infinity }} />
        <motion.div className="absolute bottom-0 left-[-60px] w-[400px] h-[400px] rounded-full bg-[#c8c0b7] blur-[90px] opacity-15"
          animate={{ scale: [1, 1.1, 1], y: [0, -30, 0] }} transition={{ duration: 16, repeat: Infinity, delay: 4 }} />
      </div>

      <SimpleBackButton />

      <main className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-10 pt-16 pb-24">
        {/* Header */}
        <motion.div style={{ y: headerY }} className="mb-12">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}>
            <span className="text-[10px] tracking-[0.5em] text-[#8f877d] block mb-3 uppercase font-medium">My Account</span>
            <h1 className="text-[clamp(40px,5.5vw,72px)] font-serif text-gray-900 leading-none tracking-tight mb-8">
              Order History
            </h1>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <TiltCard key={i} intensity={0.3}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.08 }}
                    className="bg-white/75 backdrop-blur-lg rounded-2xl p-5 border border-white/80 shadow-sm text-center"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#f0ece7] flex items-center justify-center mx-auto mb-3" style={{ transform: 'translateZ(6px)' }}>
                      <Icon className="w-4 h-4 text-[#8f877d]" />
                    </div>
                    <p className="text-2xl font-serif text-gray-900 mb-0.5" style={{ transform: 'translateZ(4px)' }}>{stat.value}</p>
                    <p className="text-[11px] text-[#8f877d] tracking-[0.1em] uppercase">{stat.label}</p>
                  </motion.div>
                </TiltCard>
              );
            })}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8f877d]" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white/70 backdrop-blur-lg border border-white/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8f877d]/30 focus:border-[#8f877d] transition-all shadow-sm"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white/70 backdrop-blur-lg border border-white/80 rounded-xl px-4 py-3.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#8f877d]/30 transition-all shadow-sm cursor-pointer min-w-[160px]"
            >
              <option value="all">All Status</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8f877d] pointer-events-none" />
          </div>
        </motion.div>

        {/* Orders */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center py-20"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Package className="w-20 h-20 text-[#d8d1c8] mx-auto mb-6" strokeWidth={1} />
              </motion.div>
              <h2 className="text-3xl font-serif text-gray-900 mb-3">No orders yet</h2>
              <p className="text-gray-500 max-w-sm mx-auto mb-4">
                {orders.length === 0 
                  ? "When you complete a checkout, your orders will appear here."
                  : "No orders match your search."}
              </p>
              <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">
                Orders are created when you complete checkout through Shopify. Check your email for order confirmations.
              </p>
              {orders.length === 0 && (
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/store')}
                  className="px-8 py-3.5 bg-gray-900 text-white rounded-xl text-sm font-medium tracking-[0.1em] uppercase hover:bg-black transition-colors shadow-xl"
                >
                  Start Shopping
                </motion.button>
              )}
            </motion.div>
          ) : (
            filteredOrders.map((order, i) => (
              <OrderCard
                key={order.id}
                order={order}
                index={i}
                onClick={() => setSelectedOrder(order)}
                formatPrice={formatPrice}
              />
            ))
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} formatPrice={formatPrice} />
        )}
      </AnimatePresence>
    </div>
  );
}
