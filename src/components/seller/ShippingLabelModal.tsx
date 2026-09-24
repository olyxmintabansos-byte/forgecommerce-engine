"use client";

import React from 'react';
import { X, Printer, ShieldAlert, Truck } from 'lucide-react';
import { Order } from '@/types/commerce';

interface ShippingLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const totalWeight = order.items.reduce((s, i) => s + (i.weightKg || 1) * i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-cyan-400">
            <Truck className="h-5 w-5" />
            <h3 className="text-sm font-bold text-white">Shipping Label Thermal (10x15 CM)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Printable Label Container */}
        <div className="p-6 bg-slate-950/50 flex justify-center">
          <div className="w-full max-w-[420px] bg-white text-slate-950 p-5 rounded-xl border-2 border-slate-950 shadow-xl font-sans text-xs space-y-3">
            {/* Courier Header & Service */}
            <div className="flex justify-between items-center pb-2 border-b-2 border-slate-950">
              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1 bg-slate-950 text-white font-black text-sm tracking-wider uppercase rounded">
                  {order.shipment.courierName}
                </div>
                <span className="font-extrabold text-xs uppercase text-slate-800">
                  {order.shipment.service}
                </span>
              </div>
              <div className="text-right">
                <span className="font-black text-sm uppercase text-slate-900">{order.destinationCity}</span>
                <p className="text-[10px] text-slate-600 font-mono">Berat: {totalWeight.toFixed(1)} kg</p>
              </div>
            </div>

            {/* Barcode & Resi Display */}
            <div className="py-2 text-center border-b-2 border-slate-950 space-y-1">
              {/* Synthetic Barcode SVG */}
              <div className="flex justify-center h-12 items-center">
                <svg viewBox="0 0 200 40" className="w-64 h-12">
                  {[4, 10, 14, 18, 26, 30, 36, 44, 48, 56, 62, 68, 76, 82, 88, 96, 104, 110, 118, 126, 134, 142, 150, 158, 166, 174, 182, 190].map((x, i) => (
                    <rect key={i} x={x} y={0} width={i % 2 === 0 ? 3 : 1.5} height={40} fill="#020617" />
                  ))}
                </svg>
              </div>
              <div className="font-mono text-base font-black tracking-widest text-slate-950">
                {order.shipment.trackingNumber}
              </div>
              <p className="text-[10px] text-slate-500 font-mono">No. Pesanan: {order.orderNumber}</p>
            </div>

            {/* Sender & Receiver Dual Column Box */}
            <div className="grid grid-cols-2 gap-3 py-2 border-b border-dashed border-slate-400 text-[10px]">
              {/* Sender */}
              <div className="border-r border-slate-300 pr-2 space-y-0.5">
                <span className="font-bold text-slate-500 uppercase block">PENGIRIM:</span>
                <p className="font-bold text-slate-900">ForgeCommerce Official Store</p>
                <p className="text-slate-700">0812-9988-7766</p>
                <p className="text-slate-600 leading-tight">Gudang Utama Hub Selatan, DKI Jakarta 12190</p>
              </div>

              {/* Receiver */}
              <div className="pl-1 space-y-0.5">
                <span className="font-bold text-slate-500 uppercase block">PENERIMA:</span>
                <p className="font-bold text-slate-900">{order.customerName}</p>
                <p className="text-slate-700">{order.customerPhone}</p>
                <p className="text-slate-600 leading-tight">{order.address}, {order.destinationCity} {order.postalCode}</p>
              </div>
            </div>

            {/* Contents & Fragile Warning */}
            <div className="py-1 space-y-1 text-[10px]">
              <span className="font-bold text-slate-700 block">ISI PAKET:</span>
              <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                {order.items.map((it, idx) => (
                  <li key={idx}>
                    {it.title} ({it.quantity}x)
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-2 bg-slate-100 rounded-lg border-2 border-dashed border-slate-800 flex items-center justify-center gap-2 text-center text-[10px] font-black uppercase text-slate-900">
              <ShieldAlert className="h-4 w-4 text-slate-900 shrink-0" />
              <span>PERINGATAN: BARANG ELEKTRONIK & PRESI / JANGAN DIBANTING</span>
            </div>

            <div className="pt-1 flex justify-between text-[9px] text-slate-500 font-mono border-t border-slate-200">
              <span>Non-COD (Lunas)</span>
              <span>Dicetak otomatis via ForgeCommerce Hub</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak Label Pengiriman</span>
          </button>
        </div>
      </div>
    </div>
  );
};
