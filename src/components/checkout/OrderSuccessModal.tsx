"use client";

import React, { useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Printer, 
  Truck, 
  PackageCheck, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Copy,
  Sparkles
} from 'lucide-react';
import { Order } from '@/types/commerce';
import { toast } from '@/lib/toast';
import confetti from 'canvas-confetti';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onOpenTracker?: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  order,
  onOpenTracker,
}) => {
  useEffect(() => {
    if (isOpen && order) {
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyResi = () => {
    navigator.clipboard.writeText(order.shipment.trackingNumber);
    toast.success(`Resi ${order.shipment.trackingNumber} berhasil disalin ke clipboard!`, 'Tersalin');
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }) + ' WIB';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="text-sm font-bold text-white">Pembayaran Sukses & Pesanan Diterbitkan!</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 bg-slate-950/40 overflow-y-auto">
          <div className="w-full bg-white text-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-xl font-sans text-xs space-y-4">
            {/* Storefront Official Header */}
            <div className="flex justify-between items-start pb-4 border-b-2 border-slate-900">
              <div>
                <h2 className="text-xl font-black tracking-tight uppercase">FORGECOMMERCE</h2>
                <p className="text-[11px] text-slate-600">The Next-Gen Headless Storefront Engine</p>
                <p className="text-[10px] text-slate-500 mt-1">Gudang Hub: Jakarta Selatan, DKI Jakarta</p>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-black text-[10px] tracking-wider uppercase border border-emerald-300">
                  PAID / LUNAS
                </span>
                <p className="text-xs font-mono font-bold mt-1 text-slate-900">{order.orderNumber}</p>
                <p className="text-[10px] text-slate-500">{formattedDate}</p>
              </div>
            </div>

            {/* Delivery & Tracking Meta */}
            <div className="grid grid-cols-2 gap-4 py-2 border-b border-dashed border-slate-300 text-[11px]">
              <div>
                <span className="text-slate-500 font-semibold block">Tujuan Pengiriman:</span>
                <p className="font-bold text-slate-900">{order.customerName}</p>
                <p className="text-slate-700">{order.customerPhone}</p>
                <p className="text-slate-600 leading-snug">{order.address}, {order.destinationCity} {order.postalCode}</p>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Ekspedisi & Nomor Resi:</span>
                <p className="font-bold text-slate-900">{order.shipment.courierName} ({order.shipment.service})</p>
                <div className="mt-1 p-2 bg-slate-100 rounded-lg border border-slate-300 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">No. Resi:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-black text-xs text-indigo-900">{order.shipment.trackingNumber}</span>
                    <button
                      onClick={handleCopyResi}
                      title="Salin Resi"
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 transition"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchased Items Table */}
            <div className="space-y-2 py-2 border-b border-dashed border-slate-300">
              <div className="flex justify-between font-bold text-[10px] text-slate-500 uppercase pb-1 border-b border-slate-200">
                <span>Produk</span>
                <span className="w-16 text-center">Qty</span>
                <span className="w-24 text-right">Harga Satuan</span>
              </div>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px]">
                  <span className="font-medium text-slate-900 truncate max-w-[240px]">{item.title}</span>
                  <span className="w-16 text-center font-mono text-slate-700">{item.quantity}x</span>
                  <span className="w-24 text-right font-mono text-slate-900">Rp {item.price.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>

            {/* Payment Summary Breakdown */}
            <div className="space-y-1.5 text-[11px] pt-1">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Barang</span>
                <span className="font-mono">Rp {order.subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim ({order.shipment.courierName})</span>
                <span className="font-mono">Rp {order.shippingFee.toLocaleString('id-ID')}</span>
              </div>
              {order.voucherDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Diskon Kupon ({order.voucherCode})</span>
                  <span className="font-mono">-Rp {order.voucherDiscount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm font-black text-slate-950 pt-2 border-t-2 border-slate-900">
                <span>TOTAL PEMBAYARAN</span>
                <span className="font-mono text-base">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="text-[10px] text-slate-500 pt-1">
                Metode: <strong className="uppercase">{order.paymentMethod.replace('_', ' ')}</strong> (Lunas Terverifikasi)
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 transition"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Kwitansi</span>
            </button>
            <button
              onClick={handleCopyResi}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-800 transition"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Salin Resi</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenTracker && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTracker();
                }}
                className="px-4 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-400 border border-cyan-800/80 text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Truck className="h-4 w-4" />
                <span>Lacak Pengiriman</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
