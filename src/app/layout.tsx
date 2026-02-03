import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { TopNav } from '@/components/TopNav';
import { PropertyProvider } from '@/contexts/PropertyContext';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reputation Manager',
  description: 'Manage property reputation',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <PropertyProvider>
            <div className="flex h-screen bg-redstone-bg text-redstone-text">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <TopNav />
                <main className="flex-1 overflow-y-auto p-10 bg-redstone-bg">
                  {children}
                </main>
              </div>
            </div>
          </PropertyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
