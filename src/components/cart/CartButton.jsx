'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, MinusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

const CartButton = ({ item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await onAddToCart(item, quantity);
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      <div className="flex items-center border border-gray-200 rounded-lg">
        <button
          onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-l-lg"
          disabled={quantity <= 1}
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span className="px-3 py-1 text-gray-900 font-medium">{quantity}</span>
        <button
          onClick={() => setQuantity(prev => prev + 1)}
          className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-r-lg"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAddToCart}
        disabled={isAdding}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium
          ${isAdding 
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
          }
          transition-colors duration-200
        `}
      >
        <ShoppingCartIcon className="h-5 w-5" />
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </motion.button>
    </div>
  );
};

export default CartButton; 