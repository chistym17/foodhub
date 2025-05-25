'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon, XMarkIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';

const CartNotification = ({ isVisible, onClose, type = 'add' }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  const getNotificationContent = () => {
    switch (type) {
      case 'checkout':
        return {
          icon: <CheckCircleIcon className="h-6 w-6 text-green-600" />,
          iconBg: 'bg-green-100',
          title: 'Order Placed Successfully!',
          message: 'Your order has been placed and is being processed.'
        };
      case 'error':
        return {
          icon: <ExclamationCircleIcon className="h-6 w-6 text-red-600" />,
          iconBg: 'bg-red-100',
          title: 'Error',
          message: 'There was an error processing your order. Please try again.'
        };
      default:
        return {
          icon: <ShoppingCartIcon className="h-6 w-6 text-blue-600" />,
          iconBg: 'bg-blue-100',
          title: 'Items Added to Cart',
          message: 'Click on the cart icon in the navigation bar to view your cart and proceed to checkout.'
        };
    }
  };

  const content = getNotificationContent();

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed bottom-6 right-6 z-[100]"
        >
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-4 max-w-sm transform transition-all">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className={`${content.iconBg} p-2 rounded-full`}>
                  {content.icon}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{content.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {content.message}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartNotification; 