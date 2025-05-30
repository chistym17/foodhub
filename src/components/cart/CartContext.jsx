'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ShoppingCartIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import CartNotification from './CartNotification';
import { useAuth } from '@/hooks/useAuth';

const CartContext = createContext();
const CART_STORAGE_KEY = 'foodhub_cart';

const loadCartFromStorage = () => {
  if (typeof window === 'undefined') return [];
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};


const saveCartToStorage = (cartItems) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('add'); // 'add' or 'checkout'
  const { user, loading: authLoading, isAuthenticated } = useAuth();


  useEffect(() => {
    if (authLoading) return; 
    
    const savedCart = loadCartFromStorage();
    setCartItems(savedCart);
  }, [authLoading]); 

  useEffect(() => {
    if (authLoading) return; 
    saveCartToStorage(cartItems);
  }, [cartItems, authLoading]);

  const addToCart = useCallback(async (item, quantity) => {
    setIsLoading(true);
    try {
      setCartItems(prev => {
        const existingItem = prev.find(i => i.id === item.id);
        if (existingItem) {
          return prev.map(i => 
            i.id === item.id 
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, { ...item, quantity }];
      });
      setShowNotification(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  }, []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  const checkout = useCallback(async () => {
    if (authLoading) {
      return;
    }
    
    if (!isAuthenticated || !user) {
      setShowNotification(true);
      setNotificationType('error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId: user.id,
          items: cartItems.map(item => ({
            menuItemId: item.id,
            quantity: item.quantity
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      clearCart();
      setShowNotification(true);
      setNotificationType('checkout');
      setIsCartOpen(false);
    } catch (error) {
      setShowNotification(true);
      setNotificationType('error');
    } finally {
      setIsLoading(false);
    }
  }, [user, cartItems, clearCart, authLoading, isAuthenticated]);

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    isCartOpen,
    setIsCartOpen,
    isLoading,
    showNotification,
    setShowNotification,
    checkout,
    notificationType,
    authLoading,
    isAuthenticated,
    user
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartModal />
      <CartNotification 
        isVisible={showNotification} 
        onClose={() => setShowNotification(false)}
        type={notificationType}
      />
    </CartContext.Provider>
  );
};

const CartModal = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getCartTotal,
    getCartCount,
    checkout,
    isLoading,
    user,
    authLoading,
    isAuthenticated
  } = useCart();



  if (!isCartOpen) return null;

  const canCheckout = !authLoading && isAuthenticated && !!user;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-end"
        onClick={() => setIsCartOpen(false)}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="bg-white w-full max-w-md h-full shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Your Cart</h2>
                {getCartCount() > 0 && (
                  <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-sm">
                    {getCartCount()} items
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500">
                  Your cart is empty
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex gap-4 bg-gray-50 p-4 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                        <span className="font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t p-4 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total</span>
                  <span className="text-xl font-semibold text-gray-900">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={checkout}
                  disabled={isLoading || !canCheckout}
                  className={`
                    w-full py-3 rounded-lg font-medium transition-colors
                    ${isLoading || !canCheckout
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
                  `}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : authLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </div>
                  ) : !canCheckout ? (
                    'Sign in to Checkout'
                  ) : (
                    'Proceed to Checkout'
                  )}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CartContext; 