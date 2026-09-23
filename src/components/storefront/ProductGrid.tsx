"use client";

import React, { useState } from 'react';
import { ArrowUpDown, SlidersHorizontal, Package } from 'lucide-react';
import { Product } from '@/types/commerce';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  selectedCategory: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  selectedCategory,
}) => {
  const [sortBy, setSortBy] = useState<'POPULAR' | 'CHEAPEST' | 'PRICIEST' | 'DISCOUNT'>('POPULAR');

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'CHEAPEST') return a.price - b.price;
    if (sortBy === 'PRICIEST') return b.price - a.price;
    if (sortBy === 'DISCOUNT') return b.discountPercent - a.discountPercent;
    return b.reviewsCount - a.reviewsCount; // Popular
  });

  return (
    <div className="space-y-6">
      {/* Section Header & Sorter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Koleksi Hardware Terpilih</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-mono">
              {products.length} Barang
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {selectedCategory === 'ALL'
              ? 'Menampilkan seluruh katalog stasiun kerja premium'
              : `Menampilkan kategori: ${selectedCategory}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-xs text-slate-400">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="POPULAR">Paling Populer & Terlaris</option>
            <option value="CHEAPEST">Harga: Terendah ke Tertinggi</option>
            <option value="PRICIEST">Harga: Tertinggi ke Terendah</option>
            <option value="DISCOUNT">Diskon Terbesar</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {sortedProducts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 space-y-2">
          <Package className="h-10 w-10 mx-auto text-slate-700" />
          <p className="text-sm font-medium">Tidak ada produk yang cocok dengan pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};
