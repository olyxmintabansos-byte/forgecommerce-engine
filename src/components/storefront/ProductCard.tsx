"use client";

import React from 'react';
import { Star, ShoppingBag, Eye, Zap, Flame, ShieldCheck } from 'lucide-react';
import { Product } from '@/types/commerce';
import { toast } from '@/lib/toast';

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
  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock <= 0;

  const handleAdd = () => {
    if (isOutOfStock) {
      toast.warning('Maaf, stok produk ini sedang habis!', 'Stok Habis');
      return;
    }
    onAddToCart(product);
    toast.success(`"${product.title.slice(0, 24)}..." berhasil ditambahkan!`, 'Keranjang Diperbarui');
  };

  return (
    <div className="group rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/50 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/20 hover:-translate-y-1">
      {/* Image Container with Badges */}
      <div className="relative aspect-square overflow-hidden bg-slate-950">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-108 transition duration-700 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span
              className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md flex items-center gap-1 shadow-lg ${
                product.badge === 'FLASH SALE'
                  ? 'bg-rose-500/90 text-white border border-rose-400/50'
                  : product.badge === 'HOT'
                  ? 'bg-amber-500/90 text-slate-950 border border-amber-300/50'
                  : 'bg-emerald-500/90 text-slate-950 border border-emerald-300/50'
              }`}
            >
              {product.badge === 'FLASH SALE' && <Zap className="h-3 w-3 fill-white" />}
              {product.badge === 'HOT' && <Flame className="h-3 w-3 fill-slate-950" />}
              <span>{product.badge}</span>
            </span>
          )}

          {isLowStock && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-950/90 text-orange-400 border border-orange-700/80 backdrop-blur-sm flex items-center gap-1">
              <Flame className="h-3 w-3 text-orange-400" />
              <span>Sisa {product.stock} pcs!</span>
            </span>
          )}
        </div>

        {product.discountPercent > 0 && (
          <div className="absolute top-3 right-3 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-950/90 text-emerald-400 border border-emerald-500/40 font-mono shadow-md backdrop-blur-md">
            -{product.discountPercent}%
          </div>
        )}
      </div>

      {/* Product Meta */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-semibold text-emerald-400/90 uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-medium">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-white text-xs">{product.rating}</span>
              <span className="text-slate-500">({product.reviewsCount})</span>
            </div>
          </div>

          <h3 className="text-sm font-extrabold text-white line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
            {product.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-800/80">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-black text-white font-mono tracking-tight">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-500 line-through font-mono">
                Rp {product.originalPrice.toLocaleString('id-ID')}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 ${
              isOutOfStock
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border border-slate-700 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-950/40'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{isOutOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
