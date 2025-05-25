'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  CreditCardIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const PaymentMethodModal = ({ isOpen, onClose, onSubmit, initialData, selectedUser }) => {
  const [formData, setFormData] = useState({
    type: initialData?.type || 'CREDIT_CARD',
    details: initialData?.details || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit Payment Method' : 'Add Payment Method'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {selectedUser && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Adding payment method for{' '}
              <span className="font-medium text-gray-900">{selectedUser.name}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="PAYPAL">PayPal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details
            </label>
            <input
              type="text"
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Enter payment details"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : initialData ? 'Update' : 'Add'} Payment Method
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const UserTable = ({ users, onAddPaymentMethod, onEditPaymentMethod, onDeletePaymentMethod }) => {
  const [expandedUser, setExpandedUser] = useState(null);

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentTypeColor = (type) => {
    switch (type) {
      case 'CREDIT_CARD':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'DEBIT_CARD':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PAYPAL':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Methods</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <>
                <tr 
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.country}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user._count.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user._count.paymentMethods}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddPaymentMethod(user);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add Payment Method
                    </motion.button>
                  </td>
                </tr>
                {expandedUser === user.id && user.paymentMethods?.length > 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 bg-gray-50">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">Payment Methods</h4>
                          <button
                            onClick={() => setExpandedUser(null)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <XMarkIcon className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {user.paymentMethods.map((method) => (
                            <motion.div
                              key={method.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white rounded-lg border border-gray-100 p-4"
                            >
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPaymentTypeColor(method.type)}`}>
                                    {method.type.replace('_', ' ')}
                                  </span>
                                  <p className="text-sm text-gray-500">{method.details}</p>
                                  {method.payments?.length > 0 && (
                                    <p className="text-xs text-gray-400">
                                      {method.payments.length} payment{method.payments.length !== 1 ? 's' : ''}
                                    </p>
                                  )}
                                </div>
                                {(!method.payments || method.payments.length === 0) && (
                                  <div className="flex items-center gap-2">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => onEditPaymentMethod(method)}
                                      className="text-blue-600 hover:text-blue-700 p-1.5 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                                    >
                                      <PencilIcon className="w-4 h-4" />
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => onDeletePaymentMethod(method)}
                                      className="text-red-600 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                    >
                                      <TrashIcon className="w-4 h-4" />
                                    </motion.button>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function PaymentMethods() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      if (authLoading || !user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        
        // Fetch payment methods for each user
        const usersWithPaymentMethods = await Promise.all(
          data.map(async (user) => {
            const pmResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/payment-methods/user/${user.id}`,
              { credentials: 'include' }
            );
            if (pmResponse.ok) {
              const paymentMethods = await pmResponse.json();
              return { ...user, paymentMethods };
            }
            return { ...user, paymentMethods: [] };
          })
        );

        setUsers(usersWithPaymentMethods);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user?.id, authLoading]);

  const handleAddPaymentMethod = (user) => {
    setSelectedUser(user);
    setEditingPaymentMethod(null);
    setShowModal(true);
  };

  const handleEditPaymentMethod = (paymentMethod) => {
    setEditingPaymentMethod(paymentMethod);
    setSelectedUser(users.find(u => u.id === paymentMethod.userId));
    setShowModal(true);
  };

  const handleDeletePaymentMethod = async (paymentMethod) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment-methods/${paymentMethod.id}`,
        {
          method: 'DELETE',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete payment method');
      }

      // Update the users state to remove the deleted payment method
      setUsers(users.map(user => ({
        ...user,
        paymentMethods: user.paymentMethods?.filter(pm => pm.id !== paymentMethod.id) || []
      })));
    } catch (err) {
      console.error('Error deleting payment method:', err);
      alert(err.message);
    }
  };

  const handleModalSubmit = async (data) => {
    try {
      if (editingPaymentMethod) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payment-methods/${editingPaymentMethod.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data)
          }
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update payment method');
        }

        const updatedPaymentMethod = await response.json();
        setUsers(users.map(user => ({
          ...user,
          paymentMethods: user.paymentMethods?.map(pm => 
            pm.id === updatedPaymentMethod.id ? updatedPaymentMethod : pm
          ) || []
        })));
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment-methods`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            ...data,
            userId: selectedUser.id
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to add payment method');
        }

        const newPaymentMethod = await response.json();
        setUsers(users.map(user => ({
          ...user,
          paymentMethods: user.id === selectedUser.id 
            ? [...(user.paymentMethods || []), newPaymentMethod]
            : user.paymentMethods || []
        })));
      }
    } catch (err) {
      console.error('Error saving payment method:', err);
      throw err;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <LoadingSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="pt-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <ExclamationTriangleIcon className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <h2 className="text-xl font-semibold text-red-900 mb-2">Access Denied</h2>
              <p className="text-red-600">
                You don't have permission to access this page. Only administrators can manage payment methods.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
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
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Payment Methods Management
                </h1>
                <p className="text-gray-500 mt-1">
                  Manage payment methods for all users
                </p>
              </div>
            </div>
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
                <ExclamationTriangleIcon className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-600 font-medium">{error}</p>
              </motion.div>
            ) : users.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center"
              >
                <CreditCardIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">No Users Found</h2>
                <p className="text-gray-500">There are no users in the system</p>
              </motion.div>
            ) : (
              <motion.div
                key="users"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <UserTable
                  users={users}
                  onAddPaymentMethod={handleAddPaymentMethod}
                  onEditPaymentMethod={handleEditPaymentMethod}
                  onDeletePaymentMethod={handleDeletePaymentMethod}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <PaymentMethodModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPaymentMethod(null);
          setSelectedUser(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingPaymentMethod}
        selectedUser={selectedUser}
      />
    </div>
  );
} 