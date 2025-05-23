'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const isAuthPage = pathname === '/signin' || pathname === '/signup';

  if (isAuthPage) return null;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full bg-white/80 backdrop-blur-md z-50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="text-2xl font-bold text-gray-800">
              FoodHub
            </Link>
          </motion.div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <NavLink href="/restaurants">Restaurants</NavLink>
              <NavLink href="/menu">Menu</NavLink>
              <NavLink href="/about">About</NavLink>
              <NavLink href="/contact">Contact</NavLink>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/signin">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                Sign In
              </motion.button>
            </Link>
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Sign Up
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const NavLink = ({ href, children }) => (
  <motion.div whileHover={{ scale: 1.05 }}>
    <Link 
      href={href}
      className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
    >
      {children}
    </Link>
  </motion.div>
);

export default Navbar; 