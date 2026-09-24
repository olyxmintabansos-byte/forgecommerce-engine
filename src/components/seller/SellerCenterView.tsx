"use client";

import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Printer, 
  DollarSign, 
  ArrowUpRight,
  Send,
  Boxes,
  Layers,
  Sparkles
} from 'lucide-react';
import { StorageEngine } from '@/lib/storage';
import { Order, OrderShipment } from '@/types/commerce';
import { ShippingLabelModal } from './ShippingLabelModal';

export const SellerCenterView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterTab, setFilterTab] = useState<'ALL' | 'PENDING' | 'PROCESSED' | 'SHIPPED' | 'DELIVERED'>('ALL');
  const [selectedLabelOrder, setSelectedLabelOrder] = useState<Order | null>(null);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState<boolean>(false);

  const loadOrders = () => {
    setOrders(StorageEngine.getOrders());
  };

  useEffect(() => {
    loadOrders();
    window.addEventListener('forge_orders_updated', loadOrders);
    return () => window.removeEventListener('forge_orders_updated', loadOrders);
  }, []);

  // Action: Kemas Pesanan
  const handlePackOrder = (orderId: string) => {
    StorageEngine.updateOrderStatus(orderId, 'PROCESSED', 'Pesanan telah selesai dikemas rapi dan siap dijemput kurir.');
  };

  // Action: Request Pickup Kurir
  const handlePickupCourier = (orderId: string) => {
    StorageEngine.updateOrderStatus(orderId, 'SHIPPED', 'Kurir telah melakukan pickup paket. Sedang transit di sorting hub.');
  };

  // Action: Selesaikan Pesanan
  const handleCompleteOrder = (orderId: string) => {
    StorageEngine.updateOrderStatus(orderId, 'DELIVERED', 'Paket telah sampai di tujuan dan diterima pembeli.');
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const countPending = orders.filter((o) => o.shipment.status === 'PENDING').length;
  const countProcessed = orders.filter((o) => o.shipment.status === 'PROCESSED').length;
  const countShipped = orders.filter((o) => o.shipment.status === 'SHIPPED').length;
  const countDelivered = orders.filter((o) => o.shipment.status === 'DELIVERED').length;

  const filteredOrders = orders.filter((o) => {
    if (filterTab === 'ALL') return true;
    return o.shipment.status === filterTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Boxes className="h-4 w-4" />
            <span>Pusat Kendali Toko & Logistik</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Seller Fulfillment Center</h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola pemenuhan pesanan masuk, request pickup kurir ekspedisi, dan cetak label thermal paket.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono">
            {orders.length} Total Transaksi
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Perlu Dikemas</span>
            <Clock className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">{countPending + countProcessed}</div>
          <div className="text-[11px] text-cyan-400/80 mt-1">Siap diproses di gudang</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Sedang Dikirim</span>
            <Truck className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-indigo-400 mt-2">{countShipped}</div>
          <div className="text-[11px] text-indigo-400/80 mt-1">Dalam perjalanan kurir</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pesanan Selesai</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-2">{countDelivered}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Diterima oleh pelanggan</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Omzet Toko</span>
            <DollarSign className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 mt-2">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-amber-400/80 mt-1">Dari pesanan terbayar lunas</div>
        </div>
      </div>

      {/* Orders Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'ALL', label: 'Semua Pesanan', count: orders.length },
          { id: 'PROCESSED', label: 'Siap Dikemas', count: countProcessed },
          { id: 'SHIPPED', label: 'Dalam Pengiriman', count: countShipped },
          { id: 'DELIVERED', label: 'Selesai', count: countDelivered },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              filterTab === tab.id
                ? 'bg-slate-800 text-cyan-400 border border-cyan-800/80 shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <span>{tab.label}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-950 text-[10px] font-mono">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">No. Order & Resi</th>
                <th className="py-3 px-4">Pelanggan & Tujuan</th>
                <th className="py-3 px-4">Item Produk</th>
                <th className="py-3 px-4">Total Bayar</th>
                <th className="py-3 px-4">Kurir</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Tidak ada pesanan pada filter tab ini.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* Order & Resi */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-white">{ord.orderNumber}</div>
                      <div className="text-[10px] text-cyan-400">{ord.shipment.trackingNumber}</div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{ord.customerName}</div>
                      <div className="text-[10px] text-slate-500">{ord.destinationCity}</div>
                    </td>

                    {/* Items */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 truncate max-w-xs">
                        {ord.items[0]?.title} {ord.items.length > 1 && `+${ord.items.length - 1} lainnya`}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {ord.items.reduce((s, i) => s + i.quantity, 0)} pcs
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      Rp {ord.totalAmount.toLocaleString('id-ID')}
                    </td>

                    {/* Courier */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-300">{ord.shipment.courierName}</div>
                      <div className="text-[10px] text-slate-500">{ord.shipment.service}</div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.shipment.status === 'PROCESSED'
                            ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                            : ord.shipment.status === 'SHIPPED'
                            ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {ord.shipment.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedLabelOrder(ord);
                            setIsLabelModalOpen(true);
                          }}
                          title="Cetak Shipping Label"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>

                        {ord.shipment.status === 'PENDING' && (
                          <button
                            onClick={() => handlePackOrder(ord.id)}
                            className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[11px]"
                          >
                            Kemas
                          </button>
                        )}

                        {ord.shipment.status === 'PROCESSED' && (
                          <button
                            onClick={() => handlePickupCourier(ord.id)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px]"
                          >
                            Pickup Kurir
                          </button>
                        )}

                        {ord.shipment.status === 'SHIPPED' && (
                          <button
                            onClick={() => handleCompleteOrder(ord.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                          >
                            Selesaikan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipping Label Thermal Modal */}
      <ShippingLabelModal
        isOpen={isLabelModalOpen}
        onClose={() => setIsLabelModalOpen(false)}
        order={selectedLabelOrder}
      />
    </div>
  );
};
