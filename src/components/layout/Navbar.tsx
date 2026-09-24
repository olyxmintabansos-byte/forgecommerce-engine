"use client";

import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  RotateCcw, 
  Layers,
  Truck,
  Store,
  Boxes
} from 'lucide-react';
import { StorageEngine } from '@/lib/storage';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenTracker: () => void;
  currentView: 'storefront' | 'seller';
  setCurrentView: (view: 'storefront' | 'seller') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenTracker,
  currentView,
  setCurrentView,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [cartCount, setCartCount] = useState<number>(0);

  const updateCount = () => {
    const items = StorageEngine.getCart();
    const total = items.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  };

  useEffect(() => {
    updateCount();
    window.addEventListener('forge_cart_updated', updateCount);
    return () => window.removeEventListener('forge_cart_updated', updateCount);
  }, []);

  const categories = ['ALL', 'Keyboard', 'Audio', 'Desk Setup', 'Ergonomics', 'Accessories'];

  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 px-4 py-1.5 text-center text-[11px] font-medium text-slate-300 border-b border-slate-800/60 flex items-center justify-center gap-3">
        <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
        <span>Gunakan kode kupon <strong className="text-cyan-400 font-mono">FORGE10</strong> untuk diskon 10% di keranjang kilat!</span>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-950/40">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Layers className="h-5 w-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">FORGE</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/80 px-1.5 py-0.5 rounded">
                Storefront v2
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-none">Headless Commerce Engine</p>
          </div>
        </div>

        {/* View Switcher: Storefront vs Seller Center */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setCurrentView('storefront')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              currentView === 'storefront'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Store className="h-3.5 w-3.5" />
            <span>Storefront</span>
          </button>
          <button
            onClick={() => setCurrentView('seller')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              currentView === 'seller'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Boxes className="h-3.5 w-3.5" />
            <span>Seller Center</span>
          </button>
        </div>

        {/* Search Bar (Storefront only) */}
        {currentView === 'storefront' && (
          <div className="flex-1 max-w-sm hidden lg:block">
            <div className="relative">
              <Search className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari keyboard mekanik, standing desk, audio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Lacak Resi Button */}
          <button
            onClick={onOpenTracker}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-semibold text-xs border border-slate-800 flex items-center gap-1.5 transition-colors"
          >
            <Truck className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Lacak Resi</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={() => {
              if (confirm('Reset ulang data demo katalog, keranjang, dan pesanan?')) {
                StorageEngine.resetAll();
              }
            }}
            title="Reset Data Demo"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Quick-Cart Button (Storefront view only) */}
          {currentView === 'storefront' && (
            <button
              onClick={onOpenCart}
              className="relative px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Keranjang</span>
              {cartCount > 0 && (
                <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-slate-950 text-cyan-400 text-[10px] font-black flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Categories Bar (Storefront only) */}
      {currentView === 'storefront' && (
        <div className="border-t border-slate-900 bg-slate-950/60 px-4 sm:px-6 py-2 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-cyan-400 border border-cyan-800/60 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {cat === 'ALL' ? 'Semua Produk' : cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
