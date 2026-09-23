"use client";

import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Printer, 
  Truck, 
  PackageCheck, 
  MapPin, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Order } from '@/types/commerce';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
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
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="text-sm font-bold text-white">Pesanan Berhasil Dibayar!</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
                <p className="text-[10px] text-slate-500 mt-1">Gudang Utama: Jakarta Selatan, DKI Jakarta</p>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-extrabold text-[10px] tracking-wider uppercase border border-emerald-300">
                  PAID / LUNAS
                </span>
                <p className="text-xs font-mono font-bold mt-1">{order.orderNumber}</p>
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
                  <span className="font-mono font-black text-xs text-indigo-900">{order.shipment.trackingNumber}</span>
                </div>
              </div>
            </div>

            {/* Purchased Items Table */}
            <div className="space-y-2 py-2 border-b border-dashed border-slate-300">
              <div className="flex justify-between font-bold text-[10px] text-slate-500 uppercase pb-1 border-b border-slate-200">
                <span>Produk</span>
                <span className="w-16 text-center">Qty</span>
                <span className="w-24 text-right">Harga Satuan</span>
                <span className="w-28 text-right">Subtotal</span>
              </div>

              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px] py-1">
                  <span className="flex-1 font-semibold text-slate-900 pr-2">{item.title}</span>
                  <span className="w-16 text-center font-mono">{item.quantity}</span>
                  <span className="w-24 text-right font-mono text-slate-600">Rp {item.price.toLocaleString('id-ID')}</span>
                  <span className="w-28 text-right font-mono font-bold text-slate-900">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculation Totals */}
            <div className="pt-2 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Produk:</span>
                <span className="font-mono">Rp {order.subtotal.toLocaleString('id-ID')}</span>
              </div>

              {order.voucherDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Diskon Kupon Promo ({order.voucherCode}):</span>
                  <span className="font-mono">- Rp {order.voucherDiscount.toLocaleString('id-ID')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim ({order.shipment.courierName}):</span>
                <span className="font-mono">Rp {order.shippingFee.toLocaleString('id-ID')}</span>
              </div>

              <div className="pt-2 border-t-2 border-slate-900 flex justify-between text-sm font-black text-slate-950">
                <span>TOTAL AKHIR PEMBAYARAN:</span>
                <span className="font-mono text-base">Rp {order.totalAmount.toLocaleString('id-ID')}</span>
              </div>

              <div className="flex justify-between text-slate-600 pt-1 text-[10px]">
                <span>Metode Pembayaran:</span>
                <span className="font-bold">{order.paymentMethod.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Electronic Seal Footer */}
            <div className="pt-4 text-center border-t border-dashed border-slate-300 text-[10px] text-slate-500 space-y-1">
              <p>Invoice elektronik ini sah dan diakui sebagai bukti transaksi resmi ForgeCommerce Engine.</p>
              <p className="font-mono text-[9px]">Gunakan Nomor Resi {order.shipment.trackingNumber} untuk pelacakan live kurir pada menu Shipment Tracker.</p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between no-print">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Kembali ke Toko
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-cyan-500/25"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak Invoice Elektronik</span>
          </button>
        </div>
      </div>
    </div>
  );
};
