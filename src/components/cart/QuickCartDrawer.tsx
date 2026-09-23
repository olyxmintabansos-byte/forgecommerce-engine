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
  ShieldCheck
} from 'lucide-react';
import { CartItem, VoucherCoupon } from '@/types/commerce';
import { StorageEngine } from '@/lib/storage';

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

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError(null);
    const vouchers = StorageEngine.getVouchers();
    const found = vouchers.find(
      (v) => v.code.toUpperCase() === couponCode.trim().toUpperCase()
    );

    if (!found) {
      setVoucherError('Kode voucher tidak ditemukan!');
      return;
    }

    if (rawSubtotal < found.minSpend) {
      setVoucherError(
        `Minimal belanja Rp ${found.minSpend.toLocaleString('id-ID')} untuk voucher ini.`
      );
      return;
    }

    setAppliedVoucher(found);
    setCouponCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-slide-in-right">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Keranjang Belanja Kilat</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {cart.reduce((s, i) => s + i.quantity, 0)} item
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
              <ShoppingBag className="h-12 w-12 text-slate-700" />
              <p className="text-sm font-medium">Keranjang belanja Anda masih kosong.</p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Mulai Belanja Sekarang
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex gap-3 relative group"
              >
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-lg object-cover bg-slate-900 shrink-0 border border-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate">
                    {item.product.title}
                  </h4>
                  <p className="text-[11px] text-cyan-400 font-mono mt-0.5">
                    Rp {item.product.price.toLocaleString('id-ID')}
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                      <button
                        onClick={() =>
                          StorageEngine.updateCartQuantity(
                            item.product.id,
                            item.quantity - 1
                          )
                        }
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-bold text-white px-2 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          StorageEngine.updateCartQuantity(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        StorageEngine.updateCartQuantity(item.product.id, 0)
                      }
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Voucher & Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-4">
            {/* Voucher Coupon Form */}
            <div>
              {appliedVoucher ? (
                <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-800/80 flex items-center justify-between text-xs text-cyan-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-cyan-400" />
                    <span>
                      Voucher <strong>{appliedVoucher.code}</strong> aktif! (-Rp {discountAmount.toLocaleString('id-ID')})
                    </span>
                  </div>
                  <button
                    onClick={() => setAppliedVoucher(null)}
                    className="text-slate-400 hover:text-white text-xs underline"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Masukkan kode kupon..."
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white focus:outline-none uppercase font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg border border-slate-700 transition-colors"
                  >
                    Klaim
                  </button>
                </form>
              )}
              {voucherError && (
                <p className="text-[10px] text-rose-400 mt-1">{voucherError}</p>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal Barang:</span>
                <span className="text-white font-mono">Rp {rawSubtotal.toLocaleString('id-ID')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-cyan-400">
                  <span>Diskon Kupon Promo:</span>
                  <span className="font-mono">- Rp {discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                <span>Total Estimasi:</span>
                <span className="text-cyan-400 font-mono text-base">
                  Rp {finalSubtotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => {
                onProceedCheckout(appliedVoucher);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
            >
              <span>Lanjut ke Pengiriman & Pembayaran</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
