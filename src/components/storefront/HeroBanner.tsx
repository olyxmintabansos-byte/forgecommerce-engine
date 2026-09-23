"use client";

import React, { useEffect, useState } from 'react';
import { Flame, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '@/types/commerce';

interface HeroBannerProps {
  featuredProduct: Product;
  onAddToCart: (p: Product) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ featuredProduct, onAddToCart }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 8,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 border border-slate-800 p-6 sm:p-10 shadow-2xl">
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <Zap className="h-3.5 w-3.5 fill-cyan-400" />
              <span>Flash Sale Hari Ini</span>
            </span>
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-800">
              <span className="text-rose-400 font-bold">Berakhir dalam:</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-950 text-white font-bold">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              :
              <span className="px-1.5 py-0.5 rounded bg-slate-950 text-white font-bold">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              :
              <span className="px-1.5 py-0.5 rounded bg-slate-950 text-cyan-400 font-bold">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Tingkatkan Stasiun Kerja Anda ke Level Tertinggi
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
            Perangkat keras pilihan arsitek dan insinyur piranti lunak. Keyboard mekanik gasket akustik creamy, standing desk dual-motor, dan audio presisi tinggi.
          </p>

          <div className="flex items-baseline gap-3 pt-2">
            <span className="text-3xl font-black text-white font-mono">
              Rp {featuredProduct.price.toLocaleString('id-ID')}
            </span>
            <span className="text-base text-slate-500 line-through font-mono">
              Rp {featuredProduct.originalPrice.toLocaleString('id-ID')}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300">
              Hemat {featuredProduct.discountPercent}%
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onAddToCart(featuredProduct)}
              className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-xl shadow-cyan-500/25 active:scale-95"
            >
              <span>Beli Produk Unggulan</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-xs text-slate-400 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Garansi Resmi 2 Tahun Ganti Baru</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Showcase Image */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500 to-indigo-600 opacity-30 blur-xl group-hover:opacity-50 transition duration-500" />
            <img
              src={featuredProduct.image}
              alt={featuredProduct.title}
              className="relative w-full max-w-md h-72 sm:h-80 object-cover rounded-2xl border border-slate-700 shadow-2xl"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white truncate">{featuredProduct.title}</p>
                <p className="text-[11px] text-cyan-400">Rating {featuredProduct.rating} ★ ({featuredProduct.reviewsCount} review)</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Tersisa {featuredProduct.stock} Unit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
