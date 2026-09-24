"use client";

import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  CheckCircle2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { CartItem, VoucherCoupon } from '@/types/commerce';
import { StorageEngine } from '@/lib/storage';
import { toast } from '@/lib/toast';

interface QuickCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onProceedCheckout: (voucher: VoucherCoupon | null) => void;
}

export const QuickCartDrawer: React.FC<QuickCartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onProceedCheckout,
}) => {
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherCoupon | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);

  if (!isOpen) return null;

  const rawSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const calculateDiscount = (): number => {
    if (!appliedVoucher) return 0;
    if (rawSubtotal < appliedVoucher.minSpend) return 0;

    if (appliedVoucher.discountType === 'PERCENT') {
      const computed = (rawSubtotal * appliedVoucher.discountValue) / 100;
      return Math.min(computed, 200000); // Max cap 200k
    }
    return appliedVoucher.discountValue;
  };

  const discountAmount = calculateDiscount();
  const finalSubtotal = Math.max(0, rawSubtotal - discountAmount);

  const applyVoucherCode = (code: string) => {
    setVoucherError(null);
    const vouchers = StorageEngine.getVouchers();
    const found = vouchers.find(
      (v) => v.code.toUpperCase() === code.trim().toUpperCase()
    );

    if (!found) {
      setVoucherError('Kode voucher tidak valid!');
      toast.error('Kode voucher tidak ditemukan!', 'Voucher Gagal');
      return;
    }

    if (rawSubtotal < found.minSpend) {
      const msg = `Minimal belanja Rp ${found.minSpend.toLocaleString('id-ID')} untuk voucher ini.`;
      setVoucherError(msg);
      toast.warning(msg, 'Syarat Minimal Belanja');
      return;
    }

    setAppliedVoucher(found);
    setCouponCode('');
    toast.success(`Voucher ${found.code} berhasil diterapkan!`, 'Hemat Belanja');
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    applyVoucherCode(couponCode);
  };

  const handleUpdateQuantity = (productId: string, newQty: number) => {
    StorageEngine.updateCartQuantity(productId, newQty);
  };

  const handleRemoveItem = (productId: string, title: string) => {
    StorageEngine.removeFromCart(productId);
    toast.info(`"${title.slice(0, 20)}..." dihapus dari keranjang`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-slide-in-right">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">Keranjang Belanja</h3>
              <p className="text-[11px] text-slate-400">
                {cart.reduce((s, i) => s + i.quantity, 0)} produk siap checkout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="h-16 w-16 rounded-full bg-slate-800/60 flex items-center justify-center text-slate-500">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <p className="text-sm font-semibold text-slate-300">Keranjang masih kosong</p>
              <p className="text-xs text-slate-500 max-w-xs">
                Pilih produk keyboard mekanik atau audio favorit Anda dari katalog toko.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex gap-3 items-center group hover:border-slate-700 transition"
              >
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">{item.product.title}</h4>
                  <div className="text-xs font-mono font-bold text-emerald-400 mt-1">
                    Rp {item.product.price.toLocaleString('id-ID')}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-slate-800 rounded-lg bg-slate-900">
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:text-white text-slate-400 transition"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:text-white text-slate-400 transition"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.product.id, item.product.title)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                      title="Hapus"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Voucher & Footer */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/90 space-y-4">
            {/* Voucher Presets */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-400" /> Voucher Spesial:
                </span>
                <span className="text-[10px] text-slate-500">Klik untuk pasang</span>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {['FORGE10', 'TECH50K', 'ONGKIRFREE'].map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => applyVoucherCode(code)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold transition flex items-center gap-1"
                  >
                    <Tag className="h-2.5 w-2.5" />
                    <span>{code}</span>
                  </button>
                ))}
              </div>

              {/* Custom Voucher Input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ketik kode kupon..."
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white uppercase font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
                >
                  Terapkan
                </button>
              </form>

              {appliedVoucher && (
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
                  <span className="font-mono font-bold">VOUCHER {appliedVoucher.code} AKTIF</span>
                  <button
                    onClick={() => setAppliedVoucher(null)}
                    className="text-[10px] text-slate-400 hover:text-white underline"
                  >
                    Hapus
                  </button>
                </div>
              )}

              {voucherError && (
                <p className="text-[11px] text-rose-400">{voucherError}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Barang</span>
                <span className="font-mono">Rp {rawSubtotal.toLocaleString('id-ID')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Diskon Kupon</span>
                  <span className="font-mono">-Rp {discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Belanja</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  Rp {finalSubtotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Checkout Proceed */}
            <button
              onClick={() => {
                onClose();
                onProceedCheckout(appliedVoucher);
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/40 transition active:scale-95"
            >
              <span>Lanjut ke Pengiriman & Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
