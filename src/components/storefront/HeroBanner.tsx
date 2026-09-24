"use client";

import React, { useEffect, useState } from 'react';
import { Flame, Sparkles, ArrowRight, ShieldCheck, Zap, Star } from 'lucide-react';
import { Product } from '@/types/commerce';
import { toast } from '@/lib/toast';

interface HeroBannerProps {
  featuredProduct: Product;
  onAddToCart: (p: Product) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ featuredProduct, onAddToCart }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 7,
    minutes: 38,
    seconds: 42,
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

  const handleHeroAdd = () => {
    onAddToCart(featuredProduct);
    toast.success(`"${featuredProduct.title}" berhasil ditambahkan!`, 'Flash Sale Berhasil Diambil');
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 border border-slate-800 p-6 sm:p-10 shadow-2xl">
      {/* Background glow orbs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black flex items-center gap-1.5 uppercase tracking-wider shadow-lg shadow-emerald-950/50">
              <Zap className="h-3.5 w-3.5 fill-slate-950" />
              <span>FLASH SALE EKSKLUSIF</span>
            </span>

            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-200 bg-slate-900/90 px-3.5 py-1 rounded-full border border-slate-800">
              <span className="text-rose-400 font-bold flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> Berakhir Dalam:
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-950 text-white font-bold">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              :
              <span className="px-1.5 py-0.5 rounded bg-slate-950 text-white font-bold">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              :
              <span className="px-1.5 py-0.5 rounded bg-slate-950 text-emerald-400 font-bold">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Tingkatkan Setup Kerja Anda ke Tingkat Tertinggi
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
            Perangkat keras pilihan arsitek dan insinyur piranti lunak. Keyboard mekanik gasket akustik creamy, standing desk dual-motor, dan audio presisi ultra tinggi.
          </p>

          <div className="flex items-baseline gap-3 pt-1">
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
              Rp {featuredProduct.price.toLocaleString('id-ID')}
            </span>
            <span className="text-base text-slate-500 line-through font-mono">
              Rp {featuredProduct.originalPrice.toLocaleString('id-ID')}
            </span>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-rose-950/90 border border-rose-700 text-rose-300">
              Hemat {featuredProduct.discountPercent}%
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={handleHeroAdd}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-xl shadow-emerald-950/50 active:scale-95"
            >
              <span>Klaim Flash Sale Sekarang</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-300 px-3.5 py-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Garansi Resmi 2 Tahun Ganti Baru</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Showcase Image */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-30 blur-2xl group-hover:opacity-50 transition duration-700" />
            <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950">
              <img
                src={featuredProduct.image}
                alt={featuredProduct.title}
                className="w-full max-w-md h-72 sm:h-84 object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                    {featuredProduct.category}
                  </span>
                  <span className="text-xs font-bold text-white block truncate max-w-[200px]">
                    {featuredProduct.title}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>{featuredProduct.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
