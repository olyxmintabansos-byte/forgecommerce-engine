"use client";

import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Zap, 
  CheckCircle2
} from 'lucide-react';
import { Product, FlashSaleSettings } from '@/types/commerce';
import { StorageEngine } from '@/lib/storage';
import { AddProductModal } from './AddProductModal';

export const ProductManagerView: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [flashSale, setFlashSale] = useState<FlashSaleSettings>(StorageEngine.getFlashSaleSettings());
  const [flashTitle, setFlashTitle] = useState<string>('');
  const [flashHours, setFlashHours] = useState<number>(12);
  const [isSavedFlash, setIsSavedFlash] = useState<boolean>(false);

  const loadData = () => {
    setProducts(StorageEngine.getProducts());
    const fs = StorageEngine.getFlashSaleSettings();
    setFlashSale(fs);
    setFlashTitle(fs.title);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('forge_products_updated', loadData);
    return () => window.removeEventListener('forge_products_updated', loadData);
  }, []);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus produk "${title}" dari katalog?`)) {
      StorageEngine.deleteProduct(id);
    }
  };

  const handleSaveFlashSale = (e: React.FormEvent) => {
    e.preventDefault();
    const newEndsAt = new Date(Date.now() + 1000 * 60 * 60 * flashHours).toISOString();
    const newSettings: FlashSaleSettings = {
      ...flashSale,
      title: flashTitle || flashSale.title,
      endsAt: newEndsAt,
    };
    StorageEngine.saveFlashSaleSettings(newSettings);
    setFlashSale(newSettings);
    setIsSavedFlash(true);
    setTimeout(() => setIsSavedFlash(false), 3000);
  };

  const filtered = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'ALL' || p.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
            <h3 className="text-base font-bold text-white">Pengaturan Kampanye Flash Sale Storefront</h3>
          </div>
          {isSavedFlash && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Pengaturan Flash Sale tersinkronisasi!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveFlashSale} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-6">
            <label className="text-[11px] text-slate-400 font-medium">Judul Headline Banner Flash Sale</label>
            <input
              type="text"
              value={flashTitle}
              onChange={(e) => setFlashTitle(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="md:col-span-4">
            <label className="text-[11px] text-slate-400 font-medium">Reset Durasi Timer dari Sekarang</label>
            <select
              value={flashHours}
              onChange={(e) => setFlashHours(Number(e.target.value))}
              className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
            >
              <option value={2}>2 Jam (Kilat)</option>
              <option value={6}>6 Jam (Setengah Hari)</option>
              <option value={12}>12 Jam (Standar Payday)</option>
              <option value={24}>24 Jam (Seharian Penuh)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              Update Banner
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama produk SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="Keyboard">Keyboard</option>
            <option value="Audio">Audio</option>
            <option value="Desk Setup">Desk Setup</option>
            <option value="Ergonomics">Ergonomics</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>

        <button
          onClick={() => {
            setProductToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Produk</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Harga Jual</th>
                <th className="py-3 px-4">Stok</th>
                <th className="py-3 px-4">Badge</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Tidak ada produk pada filter ini.
                  </td>
                </tr>
              ) : (
                filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-10 h-10 rounded-lg object-cover bg-slate-950 border border-slate-800 shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-white truncate max-w-xs">{prod.title}</div>
                        <div className="text-[10px] text-slate-500">{prod.weightKg} kg</div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-300">{prod.category}</td>

                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-white">Rp {prod.price.toLocaleString('id-ID')}</div>
                      {prod.discountPercent > 0 && (
                        <div className="text-[10px] text-slate-500 line-through">
                          Rp {prod.originalPrice.toLocaleString('id-ID')} (-{prod.discountPercent}%)
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`font-mono font-bold ${prod.stock < 10 ? 'text-rose-400' : 'text-slate-200'}`}>
                        {prod.stock} unit
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {prod.badge ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-800 text-cyan-300 border border-slate-700">
                          {prod.badge}
                        </span>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setProductToEdit(prod);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Edit Produk"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(prod.id, prod.title)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
      />
    </div>
  );
};