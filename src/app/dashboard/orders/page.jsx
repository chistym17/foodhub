'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-64"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, j) => (
              <div key={j} className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    ))}
  </div>
);

const OrderStatus = ({ status, onStatusChange, canManage }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'PENDING':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: ClockIcon,
          text: 'Pending',
          nextStatus: 'COMPLETED'
        };
      case 'PROCESSING':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: ClockIcon,
          text: 'Processing',
          nextStatus: 'COMPLETED'
        };
      case 'COMPLETED':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircleIcon,
          text: 'Completed',
          nextStatus: null
        };
      case 'CANCELLED':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircleIcon,
          text: 'Cancelled',
          nextStatus: null
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: ClockIcon,
          text: status,
          nextStatus: null
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${config.color}`}
      >
        <Icon className="w-4 h-4" />
        {config.text}
      </motion.span>
      {canManage && config.nextStatus && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onStatusChange(config.nextStatus)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Mark as {config.nextStatus.toLowerCase()}
        </motion.button>
      )}
    </div>
  );
};

const OrderCard = ({ order, index, onStatusChange, onDelete, canManage }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdating(true);
      await onStatusChange(order.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(order.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-900 text-lg">Order #{order.id}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4" />
              {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <OrderStatus 
              status={order.status} 
              onStatusChange={handleStatusChange}
              canManage={canManage}
            />
            {canManage && !order.payment && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isDeleting}
                  className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                >
                  <TrashIcon className="w-5 h-5" />
                </motion.button>

                <AnimatePresence>
                  {showDeleteConfirm && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 p-4 z-10"
                    >
                      <div className="flex items-start gap-3">
                        <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">Delete Order?</p>
                          <p className="text-sm text-gray-500 mt-1">This action cannot be undone.</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 disabled:opacity-50"
                        >
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {order.items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex justify-between items-center group"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {item.menuItem.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    {item.menuItem.name}
                  </p>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                </div>
              </div>
              <p className="font-medium text-gray-900">
                ${(item.menuItem.price * item.quantity).toFixed(2)}
              </p>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 pt-6 border-t border-gray-100"
        >
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total Amount</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function MyOrders() {
  const { user, loading: authLoading, isAdmin, isManager } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const canManageOrders = isAdmin || isManager;

  useEffect(() => {
    const fetchOrders = async () => {
      if (authLoading || !user?.id) return;

      try {
        setLoading(true);
        const endpoint = canManageOrders 
          ? `${process.env.NEXT_PUBLIC_API_URL}/orders`  // Fetch all orders for admin/manager
          : `${process.env.NEXT_PUBLIC_API_URL}/orders/my-orders/${user.id}`; // Fetch user's orders for regular users

        const response = await fetch(endpoint, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id, authLoading, canManageOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ status: newStatus })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const updatedOrder = await response.json();
      setOrders(orders.map(order => 
        order.id === orderId ? updatedOrder : order
      ));
    } catch (err) {
      console.error('Error updating order status:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (orderId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete order');
      }

      setOrders(orders.filter(order => order.id !== orderId));
    } catch (err) {
      console.error('Error deleting order:', err);
      setError(err.message);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="pt-20 px-4">
          <div className="max-w-4xl mx-auto">
            <LoadingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="pt-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Please sign in to view your orders</h1>
              <p className="text-gray-500">Sign in to access your order history</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="pt-20 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.button
            onClick={() => router.push('/dashboard')}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            whileHover={{ x: -4 }}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Dashboard
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {canManageOrders ? 'All Orders' : 'My Orders'}
            </h1>
            <p className="text-gray-500 mt-1">
              {canManageOrders 
                ? 'Manage and track all customer orders' 
                : 'Track your order history'}
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <LoadingSkeleton key="loading" />
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
              >
                <XCircleIcon className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-600 font-medium">{error}</p>
              </motion.div>
            ) : orders.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
              >
                <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
                <p className="text-gray-500">Start ordering your favorite meals to see them here</p>
              </motion.div>
            ) : (
              <motion.div
                key="orders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {orders.map((order, index) => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    index={index}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    canManage={canManageOrders}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
} 