import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Calendar, Truck, Check, X, ArrowRight, ChevronDown, Filter, Search } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
  tracking?: string;
}

interface OrdersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockOrders: Order[] = [
  {
    id: 'REM-2024-001',
    date: '2024-02-15',
    status: 'delivered',
    total: 299,
    items: 1,
    tracking: '1Z999AA1234567847'
  },
  {
    id: 'REM-2024-002', 
    date: '2024-02-20',
    status: 'shipped',
    total: 598,
    items: 2,
    tracking: '1Z999AA1234567848'
  },
  {
    id: 'REM-2024-003',
    date: '2024-02-25',
    status: 'processing',
    total: 299,
    items: 1
  }
];

const statusColors = {
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const statusIcons = {
  processing: Package,
  shipped: Truck,
  delivered: Check,
  cancelled: X
};

export function OrdersDrawer({ isOpen, onClose }: OrdersDrawerProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const isMobile = useIsMobile();

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className={`bg-[#f5f1ed] p-0 gap-0 border-zinc-200 h-full flex flex-col overflow-hidden ${
          isMobile ? "w-full border-l shadow-2xl" : "w-full sm:max-w-2xl border-l"
        }`}
      >
        <SheetHeader className="sticky top-0 z-30 flex-shrink-0 px-6 py-6 border-b border-[#e0dbd5] bg-[#f5f1ed]">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-sm font-bold tracking-[0.2em] uppercase text-gray-900">
              Your Orders
            </SheetTitle>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Filters */}
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by order number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-[#e0dbd5] focus:border-gray-900"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none bg-white border border-[#e0dbd5] px-4 py-3 pr-10 focus:outline-none focus:border-gray-900 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-serif text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-600">You haven't placed any orders yet.</p>
                </div>
              ) : (
                filteredOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status];
                  return (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-[#e0dbd5] hover:border-gray-900 transition-all duration-300 cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <div className="p-4">
                        <div className="flex flex-col gap-3">
                          {/* Order Info */}
                          <div className="flex items-center justify-between">
                            <h3 className="font-serif text-lg text-gray-900">{order.id}</h3>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                              <StatusIcon className="h-3 w-3" />
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(order.date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </span>
                            <span>{order.items} {order.items === 1 ? 'item' : 'items'}</span>
                            <span className="font-medium text-gray-900">£{order.total}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between">
                            {order.tracking && (
                              <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                Track Package
                              </button>
                            )}
                            <ArrowRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Order Detail Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedOrder(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-lg"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-[#e0dbd5]">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-serif text-gray-900">{selectedOrder.id}</h2>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Order Status */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-900 mb-4">Order Status</h3>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusColors[selectedOrder.status]}`}>
                        {(() => {
                          const StatusIcon = statusIcons[selectedOrder.status];
                          return <StatusIcon className="h-4 w-4" />;
                        })()}
                        {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-gray-900 mb-4">Order Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date</span>
                        <span className="text-gray-900">
                          {new Date(selectedOrder.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Items</span>
                        <span className="text-gray-900">{selectedOrder.items}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total</span>
                        <span className="text-gray-900 font-medium">£{selectedOrder.total}</span>
                      </div>
                      {selectedOrder.tracking && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tracking Number</span>
                          <span className="text-gray-900">{selectedOrder.tracking}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-4">
                    <Button className="flex-1 h-12 bg-[#2D2D2D] hover:bg-black text-white text-xs font-bold tracking-[0.2em] uppercase">
                      View Invoice
                    </Button>
                    {selectedOrder.status === 'delivered' && (
                      <Button variant="outline" className="flex-1 h-12 border-[#e0dbd5] hover:bg-[#F8F5F2] text-xs font-bold tracking-[0.2em] uppercase">
                        Return Items
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
}
