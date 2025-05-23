'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import RestaurantCard from '@/components/restaurants/RestaurantCard';
import { motion } from 'framer-motion';

const RestaurantsPage = () => {
  const { user, loading: authLoading } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      if (authLoading || !user?.country) return;
      
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/restaurants/by-country/${user.country}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch restaurants');
        }

        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [user?.country, authLoading]); 

  if (authLoading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-xl h-[400px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-[1400px] mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Please sign in to view restaurants
          </h1>
          <p className="text-lg text-gray-600">
            You need to be signed in to view restaurants in your area
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <div className="h-10 w-72 bg-gray-200 rounded animate-pulse mx-auto mb-3" />
            <div className="h-6 w-56 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-xl h-[400px] animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-[1400px] mx-auto text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-3">
            Error: {error}
          </h1>
          <p className="text-lg text-gray-600">
            There was a problem loading the restaurants. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {user.country === 'INDIA' ? 'Indian' : 'American'} Restaurants
          </h1>
          <p className="text-lg text-gray-600">
            Discover the best {user.country.toLowerCase()} cuisine in your area
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {restaurants.map((restaurant, index) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <RestaurantCard restaurant={restaurant} />
            </motion.div>
          ))}
        </div>

        {restaurants.length === 0 && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-medium text-gray-900 mb-3">
              No restaurants found
            </h2>
            <p className="text-lg text-gray-600">
              We couldn't find any restaurants in your area
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantsPage; 