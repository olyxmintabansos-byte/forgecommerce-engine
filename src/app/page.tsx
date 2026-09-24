"use client";

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HeroBanner } from '@/components/storefront/HeroBanner';
import { ProductGrid } from '@/components/storefront/ProductGrid';
import { QuickCartDrawer } from '@/components/cart/QuickCartDrawer';
import { CheckoutModal } from '@/components/checkout/CheckoutModal';
import { OrderSuccessModal } from '@/components/checkout/OrderSuccessModal';
import { ShipmentTrackerModal } from '@/components/tracking/ShipmentTrackerModal';
import { SellerCenterView } from '@/components/seller/SellerCenterView';
import { StorageEngine } from '@/lib/storage';
import { Product, CartItem, VoucherCoupon, Order } from '@/types/commerce';
import { CheckCircle2, ShieldCheck, Truck, RefreshCcw, Headphones } from 'lucide-react';

export default function StorefrontPage() {
  const [currentView, setCurrentView] = useState<'storefront' | 'seller'>('storefront');
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState<boolean>(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherCoupon | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    setProducts(StorageEngine.getProducts());
    setCart(StorageEngine.getCart());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('forge_products_updated', loadData);
    window.addEventListener('forge_cart_updated', loadData);
    return () => {
      window.removeEventListener('forge_products_updated', loadData);
      window.removeEventListener('forge_cart_updated', loadData);
    };
  }, []);

  const handleAddToCart = (product: Product) => {
    StorageEngine.addToCart(product, 1);
    setToastMessage(`✓ ${product.title} ditambahkan ke keranjang!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleProceedCheckout = (voucher: VoucherCoupon | null) => {
    setAppliedVoucher(voucher);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: Order) => {
    const orders = StorageEngine.getOrders();
    orders.unshift(order);
    StorageEngine.saveOrders(orders);
    StorageEngine.clearCart();
    setCompletedOrder(order);
    setIsSuccessModalOpen(true);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredProduct = products[0] || null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        currentView={currentView}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-950 border border-cyan-700 text-cyan-200 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-slide-in-right">
          <CheckCircle2 className="h-4 w-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* VIEW CONDITIONAL: STOREFRONT VS SELLER CENTER */}
      {currentView === 'storefront' ? (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 space-y-10 w-full">
          {featuredProduct && (
            <HeroBanner
              featuredProduct={featuredProduct}
              onAddToCart={handleAddToCart}
            />
          )}

          {/* Feature Value Props */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-4 border-y border-slate-900">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <Truck className="h-5 w-5 text-cyan-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Ekspedisi Nusantara</p>
                <p className="text-[10px] text-slate-500">JNE, J&T, SiCepat Kilat</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">100% Produk Orisinal</p>
                <p className="text-[10px] text-slate-500">Garansi Resmi 2 Tahun</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <RefreshCcw className="h-5 w-5 text-purple-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Retur Ganti Baru</p>
                <p className="text-[10px] text-slate-500">7 Hari Tanpa Ribet</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <Headphones className="h-5 w-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Bantuan Teknis 24/7</p>
                <p className="text-[10px] text-slate-500">Dukungan Tim Ahli</p>
              </div>
            </div>
          </div>

          {/* Product Catalog Grid */}
          <ProductGrid
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            selectedCategory={selectedCategory}
          />
        </main>
      ) : (
        <SellerCenterView />
      )}

      {/* Quick Cart Slide-out Drawer */}
      <QuickCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onProceedCheckout={handleProceedCheckout}
      />

      {/* Multi-Step Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        appliedVoucher={appliedVoucher}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Confirmation & Electronic Receipt Modal */}
      <OrderSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        order={completedOrder}
      />

      {/* Live Resi & Shipment Tracker Modal */}
      <ShipmentTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        initialTrackingQuery={completedOrder?.shipment.trackingNumber || 'JP9823145621'}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-400">FORGECOMMERCE ENGINE v2.0</p>
        <p className="mt-1">Headless Storefront, Shipping Rate Engine & Mock Payment Gateway.</p>
      </footer>
    </div>
  );
}
