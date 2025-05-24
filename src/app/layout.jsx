import { AuthProvider } from '@/hooks/useAuth';
import { CartProvider } from '@/components/cart/CartContext';
import './globals.css';

export const metadata = {
  title: 'FoodHub - Restaurant Management',
  description: 'Modern restaurant management platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 