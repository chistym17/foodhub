'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Discover the Best
              <span className="text-blue-600"> Food </span>
              in Your Area
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Experience a world of flavors with our curated selection of restaurants. 
              Order your favorite meals with just a few clicks and enjoy doorstep delivery.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Order Now
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-gray-800 rounded-lg text-lg font-semibold border-2 border-gray-200 hover:border-gray-300 transition-colors"
              >
                View Restaurants
              </motion.button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              <StatCard number="500+" label="Restaurants" />
              <StatCard number="10k+" label="Happy Customers" />
              <StatCard number="30min" label="Delivery Time" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[600px] hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl transform rotate-3" />
            <div className="absolute inset-0 bg-white rounded-3xl shadow-xl overflow-hidden transform -rotate-3">
              <Image
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
                alt="Delicious food showcase"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ number, label }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="text-center"
  >
    <h3 className="text-3xl font-bold text-gray-900">{number}</h3>
    <p className="text-gray-600 mt-1">{label}</p>
  </motion.div>
);

export default Hero; 