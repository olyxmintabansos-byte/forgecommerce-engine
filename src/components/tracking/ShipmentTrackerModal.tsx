"use client";

import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Building2
} from 'lucide-react';
import { StorageEngine } from '@/lib/storage';
import { Order } from '@/types/commerce';

interface ShipmentTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrackingQuery?: string;
}

export const ShipmentTrackerModal: React.FC<ShipmentTrackerModalProps> = ({
  isOpen,
  onClose,
  initialTrackingQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState<string>(initialTrackingQuery || 'JP9823145621');
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    const orders = StorageEngine.getOrders();
    return orders.find(
      (o) =>
        o.shipment.trackingNumber.toLowerCase() === searchQuery.toLowerCase() ||
        o.orderNumber.toLowerCase() === searchQuery.toLowerCase()
    ) || orders[0] || null;
  });

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const orders = StorageEngine.getOrders();
    const query = searchQuery.trim().toLowerCase();
    const found = orders.find(
      (o) =>
        o.shipment.trackingNumber.toLowerCase() === query ||
        o.orderNumber.toLowerCase() === query
    );
    if (!found) {
      alert(`Pesanan atau No. Resi "${searchQuery}" tidak ditemukan! Coba gunakan nomor demo: JP9823145621`);
      return;
    }
    setActiveOrder(found);
  };

  // Live Simulation: Advance shipment to next milestone
  const handleSimulateNextStep = () => {
    if (!activeOrder) return;
    const currentStatus = activeOrder.shipment.status;

    if (currentStatus === 'PENDING') {
      StorageEngine.updateOrderStatus(activeOrder.id, 'PROCESSED', 'Penjual selesai mengemas paket & mencetak shipping label.');
    } else if (currentStatus === 'PROCESSED') {
      StorageEngine.updateOrderStatus(activeOrder.id, 'SHIPPED', 'Kurir telah mengambil paket. Paket transit di Hub Logistik Jakarta.');
    } else if (currentStatus === 'SHIPPED') {
      StorageEngine.updateOrderStatus(activeOrder.id, 'DELIVERED', 'Paket telah diantar kurir & diterima dengan baik oleh penerima.');
    } else {
      alert('Paket ini sudah berstatus DELIVERED (Selesai).');
      return;
    }

    // Refresh active order view
    const updated = StorageEngine.getOrders().find((o) => o.id === activeOrder.id);
    if (updated) setActiveOrder(updated);
  };

  const getStatusBadge = (status: Order['shipment']['status']) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">Menunggu Diproses</span>;
      case 'PROCESSED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">Sedang Dikemas</span>;
      case 'SHIPPED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">Dalam Pengiriman</span>;
      case 'DELIVERED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">Telah Diterima</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400">
            <Truck className="h-5 w-5" />
            <h3 className="text-base font-bold text-white">Live Resi & Shipment Tracker</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-950/40">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Masukkan Nomor Resi (misal: JP9823145621) atau Order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <span>Lacak</span>
            </button>
          </form>
        </div>

        {/* Tracker Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeOrder ? (
            <div className="space-y-6">
              {/* Order & Courier Meta Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400">Nomor Resi Resmi</span>
                    <div className="text-base font-black text-white font-mono tracking-wider">
                      {activeOrder.shipment.trackingNumber}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(activeOrder.shipment.status)}
                    <span className="text-xs text-slate-400 font-mono">({activeOrder.orderNumber})</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Kurir & Layanan:</span>
                    <strong className="text-slate-200">{activeOrder.shipment.courierName}</strong>
                    <p className="text-[11px] text-cyan-400">{activeOrder.shipment.service}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Rute Pengiriman:</span>
                    <strong className="text-slate-200">Jakarta Selatan</strong>
                    <p className="text-[11px] text-slate-400">➔ {activeOrder.destinationCity}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-slate-500 block text-[10px]">Penerima:</span>
                    <strong className="text-slate-200">{activeOrder.customerName}</strong>
                    <p className="text-[11px] text-slate-400 truncate">{activeOrder.address}</p>
                  </div>
                </div>
              </div>

              {/* Visual Vertical Timeline */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    <span>Riwayat Perjalanan Paket (Tracking Log)</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">Update Real-time</span>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {activeOrder.shipment.history.map((log, idx) => (
                    <div key={idx} className="relative group">
                      {/* Node Dot */}
                      <div
                        className={`absolute -left-6 top-1 h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                          idx === 0
                            ? 'bg-cyan-500 border-cyan-300 text-slate-950 shadow-md shadow-cyan-500/50'
                            : 'bg-slate-900 border-slate-700 text-slate-500'
                        }`}
                      >
                        {idx === 0 ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-600" />}
                      </div>

                      {/* Content */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-semibold ${idx === 0 ? 'text-cyan-300' : 'text-slate-300'}`}>
                            {log.description}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(log.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <MapPin className="h-3 w-3" />
                          <span>{log.location}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulation Sandbox Button */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-amber-400" />
                    <span>Simulator Pengiriman Paket (Demo Mode)</span>
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Klik untuk memajukan status paket langkah demi langkah untuk menguji logika tracking.
                  </p>
                </div>
                <button
                  onClick={handleSimulateNextStep}
                  disabled={activeOrder.shipment.status === 'DELIVERED'}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeOrder.shipment.status === 'DELIVERED'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95'
                  }`}
                >
                  ⚡ Majukan Status Paket
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Package className="h-10 w-10 mx-auto text-slate-700" />
              <p className="text-xs">Tidak ada data pelacakan yang dapat ditampilkan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
