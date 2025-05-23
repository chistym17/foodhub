import { AuthProvider } from '@/hooks/useAuth';
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
          {children}
        </AuthProvider>
      </body>
    </html>
  );
} 