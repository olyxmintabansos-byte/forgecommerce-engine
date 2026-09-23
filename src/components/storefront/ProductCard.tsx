"use client";

import React from 'react';
import { Star, ShoppingBag, Eye, Zap } from 'lucide-react';
import { Product } from '@/types/commerce';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onQuickView?: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
}) => {
  return (
    <div className="group rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20">
      {/* Image Container with Badges */}
      <div className="relative aspect-video sm:aspect-square overflow-hidden bg-slate-950">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.badge && (
            <span
              className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                product.badge === 'FLASH SALE'
                  ? 'bg-rose-900 text-rose-200 border border-rose-700'
                  : product.badge === 'HOT'
                  ? 'bg-amber-900 text-amber-200 border border-amber-700'
                  : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              }`}
            >
              {product.badge}
            </span>
          )}
        </div>

        {product.discountPercent > 0 && (
          <div className="absolute top-3 right-3 text-[10px] font-black px-2 py-0.5 rounded bg-slate-950/90 text-cyan-400 border border-slate-700 font-mono">
            -{product.discountPercent}%
          </div>
        )}
      </div>

      {/* Product Meta */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-amber-400 font-medium">
              <Star className="h-3 w-3 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-600">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-cyan-300 transition-colors">
            {product.title}
          </h3>
        </div>

        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-base font-extrabold text-white font-mono">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-500 line-through font-mono">
                Rp {product.originalPrice.toLocaleString('id-ID')}
              </span>
            )}
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-cyan-400 active:scale-95"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Tambah ke Keranjang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
