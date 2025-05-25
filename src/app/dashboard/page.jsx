'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import {
  UserCircleIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const DashboardCard = ({ title, icon: Icon, onClick, children, variant = 'default' }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'border-red-100 hover:shadow-red-100/50';
      case 'admin':
        return 'border-blue-100 hover:shadow-blue-100/50';
      default:
        return 'border-gray-100 hover:shadow-gray-100/50';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border ${getVariantStyles()} p-6 cursor-pointer hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${
          variant === 'danger' 
            ? 'from-red-50 to-red-100' 
            : variant === 'admin'
            ? 'from-blue-50 to-indigo-50'
            : 'from-gray-50 to-gray-100'
        } rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${
            variant === 'danger' 
              ? 'text-red-600' 
              : variant === 'admin'
              ? 'text-blue-600'
              : 'text-gray-600'
          }`} />
        </div>
        <div>
          <h3 className={`font-semibold ${
            variant === 'danger' 
              ? 'text-red-600' 
              : variant === 'admin'
              ? 'text-blue-600'
              : 'text-gray-900'
          }`}>{title}</h3>
          {children}
        </div>
      </div>
    </motion.div>
  );
};

const ProfileSection = ({ user }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
  >
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
          <UserCircleIcon className="w-12 h-12 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>
    </div>
    
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-600">
            <EnvelopeIcon className="w-5 h-5" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <PhoneIcon className="w-5 h-5" />
            <span>{user.phone || 'Not provided'}</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-gray-600">
            <MapPinIcon className="w-5 h-5" />
            <span>{user.address || 'Not provided'}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-600">
            <CreditCardIcon className="w-5 h-5" />
            <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const { user, loading: authLoading, logout, isAdmin, isManager } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const canManageOrders = isAdmin || isManager;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="pt-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-48 bg-white rounded-xl"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-white rounded-xl"></div>
                ))}
              </div>
            </div>
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
              <UserCircleIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Please sign in to access your dashboard</h1>
              <p className="text-gray-500">Sign in to view your profile and manage your orders</p>
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
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back, {user.name}
              {canManageOrders && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {isAdmin ? 'Administrator' : 'Manager'}
                </span>
              )}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProfileSection user={user} />
            </div>
            
            <div className="space-y-6">
              <DashboardCard
                title={canManageOrders ? "All Orders" : "My Orders"}
                icon={ShoppingBagIcon}
                onClick={() => router.push('/dashboard/orders')}
                variant="admin"
              >
                <p className="text-sm text-gray-500">
                  {canManageOrders 
                    ? "View, process, and manage all customer orders"
                    : "View and track your order history"}
                </p>
                {canManageOrders && (
                  <p className="text-xs text-blue-600 mt-1">
                    You can process payments and delete orders
                  </p>
                )}
              </DashboardCard>

              <DashboardCard
                title="Payment Methods"
                icon={CreditCardIcon}
                onClick={() => {/* TODO: Implement payment methods */}}
              >
                <p className="text-sm text-gray-500">
                  {isAdmin 
                    ? "Manage payment methods for all users"
                    : "Manage your payment methods"}
                </p>
              </DashboardCard>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full bg-white rounded-xl shadow-sm border border-red-100 p-6 cursor-pointer hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors duration-200">
                    <ArrowRightOnRectangleIcon className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-600">Sign Out</h3>
                    <p className="text-sm text-gray-500">
                      {isLoggingOut ? 'Signing out...' : 'Sign out of your account'}
                    </p>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 