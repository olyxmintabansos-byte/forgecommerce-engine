"use client";

import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Truck, 
  Download, 
  TrendingUp
} from 'lucide-react';
import { Order } from '@/types/commerce';
import { StorageEngine } from '@/lib/storage';

export const AnalyticsView: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setOrders(StorageEngine.getOrders());
  }, []);

  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalUnitsSold = orders.reduce(
    (sum, o) => sum + o.items.reduce((s, it) => s + it.quantity, 0),
    0
  );
  const averageOrderValue = orders.length > 0 ? Math.round(totalGMV / orders.length) : 0;

  const courierCounts: Record<string, number> = {};
  orders.forEach((o) => {
    const code = o.shipment.courierName || 'Lainnya';
    courierCounts[code] = (courierCounts[code] || 0) + 1;
  });

  const handleExportCSV = () => {
    const rows = [
      ['Nomor Pesanan', 'Nomor Resi', 'Nama Pelanggan', 'Kota Tujuan', 'Kurir', 'Total Bayar (Rp)', 'Metode Bayar', 'Status', 'Tanggal'],
      ...orders.map((o) => [
        o.orderNumber,
        o.shipment.trackingNumber,
        `"${o.customerName}"`,
        `"${o.destinationCity}"`,
        o.shipment.courierName,
        o.totalAmount,
        o.paymentMethod,
        o.shipment.status,
        o.createdAt,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `laporan_penjualan_forgecommerce_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Gross Merchandise Value (GMV)</span>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-2">
            Rp {totalGMV.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-400/70 mt-1">Total omzet dari {orders.length} transaksi</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Unit Terjual</span>
            <ShoppingBag className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white mt-2">{totalUnitsSold} Pcs</div>
          <div className="text-[11px] text-cyan-400/70 mt-1">Akumulasi seluruh SKU terbayar</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Rata-Rata Nilai Pesanan (AOV)</span>
            <TrendingUp className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400 mt-2">
            Rp {averageOrderValue.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-indigo-400/70 mt-1">Per transaksi checkout</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Truck className="h-4 w-4 text-cyan-400" />
            <span>Distribusi Preferensi Kurir Ekspedisi</span>
          </h3>

          <div className="space-y-3 pt-2">
            {Object.keys(courierCounts).length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">Belum ada data transaksi pengiriman.</p>
            ) : (
              Object.entries(courierCounts).map(([courier, count]) => {
                const pct = Math.round((count / orders.length) * 100);
                return (
                  <div key={courier} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{courier}</span>
                      <span className="font-mono font-bold text-cyan-400">{count} paket ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 border border-indigo-800/40 space-y-4 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded">
              Laporan Keuangan & Audit
            </span>
            <h3 className="text-base font-bold text-white mt-2">Unduh Laporan Penjualan Lengkap (CSV / Excel)</h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Daftar seluruh transaksi yang mencakup nomor resi, ongkos kirim, diskon kupon, dan status pemenuhan untuk pembukuan akuntansi.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Download className="h-4 w-4" />
            <span>Export Data Transaksi (.CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
};