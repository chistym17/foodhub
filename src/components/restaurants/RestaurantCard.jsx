'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import MenuModal from './MenuModal';

const RestaurantCard = ({ restaurant }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleViewMenu = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/restaurants/${restaurant.id}/menu`);
      const data = await response.json();
      setMenuItems(data.menuItems);
      setIsMenuOpen(true);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get Unsplash images based on country
  const getImageUrl = () => {
    const images = {
      INDIA: [
        '/louis-hansel--9CjvlbUGhY-unsplash.jpg',
        '/edward-howell-vvUy1hWVYEA-unsplash.jpg',
        '/mihai-moisa-Djtc1T38-GY-unsplash.jpg',
        '/paul-griffin-WWST6E8LxeE-unsplash.jpg',
      ],
      AMERICA: [
        '/edward-howell-vvUy1hWVYEA-unsplash.jpg',
        '/paul-griffin-WWST6E8LxeE-unsplash.jpg',
        '/volkan-vardar-1H30uRC1plc-unsplash.jpg',
        '/louis-hansel--9CjvlbUGhY-unsplash.jpg',
        '/mihai-moisa-Djtc1T38-GY-unsplash.jpg'
      ]
    };
    const countryImages = images[restaurant.country];
    return countryImages[Math.floor(Math.random() * countryImages.length)];
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-[450px] flex flex-col border border-gray-100"
      >
        <div className="relative h-72 w-full overflow-hidden">
          <Image
            src={getImageUrl()}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80" />
          
          {/* Restaurant Status Badge */}
          <div className="absolute top-5 right-5">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              Open Now
            </span>
          </div>

          {/* Restaurant Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                {restaurant.country.toLowerCase()} Cuisine
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
              {restaurant.name}
            </h3>
          </div>
        </div>
        
        <div className="p-8 flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50">
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium">Downtown Location</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium">30-45 min delivery</span>
            </div>
          </div>

          <div className="mt-auto flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleViewMenu}
              disabled={loading}
              className="w-[200px] bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md text-sm"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <span>View Menu</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        restaurant={restaurant}
        menuItems={menuItems}
      />
    </>
  );
};

export default RestaurantCard; 