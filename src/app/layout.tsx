import type { Metadata } from 'next';
import './globals.css';
import { ToastContainer } from '@/components/ui/ToastContainer';

export const metadata: Metadata = {
  title: 'ForgeCommerce | Next-Gen Luxury Headless Storefront & Marketplace',
  description: 'Platform E-Commerce Modern, Keranjang Kilat, Ongkir Nusantara, & Mock Payment Gateway',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
