'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/get-token', {
          credentials: 'include'
        });
        const { token } = await response.json();
        
        if (token) {
          try {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 > Date.now()) {
              setUser({
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
                name: decoded.name
              });
            } else {
              setUser(null);
            }
          } catch (error) {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      router.push('/');
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUserState = async () => {
    try {
      const response = await fetch('/api/auth/get-token', {
        credentials: 'include'
      });
      const { token } = await response.json();
      
      if (token) {
        const decoded = jwtDecode(token);
        setUser({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name
        });
      }
    } catch (error) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      logout,
      updateUserState,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN',
      isManager: user?.role === 'MANAGER'
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 