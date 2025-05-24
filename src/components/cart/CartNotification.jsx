'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';

const CartNotification = ({ isVisible, onClose }) => {
  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

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
                <div className="bg-blue-100 p-2 rounded-full">
                  <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Items Added to Cart</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Click on the cart icon in the navigation bar to view your cart and proceed to checkout.
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