"use client";

import React, { useState, useEffect } from 'react';
import { X, Plus, PackagePlus } from 'lucide-react';
import { Product, ProductCategory } from '@/types/commerce';
import { StorageEngine } from '@/lib/storage';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

const PRESET_IMAGES: Record<ProductCategory, string[]> = {
  Keyboard: [
    'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80',
  ],
  Audio: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
  ],
  'Desk Setup': [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80',
  ],
  Ergonomics: [
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&auto=format&fit=crop&q=80',
  ],
  Accessories: [
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
  ],
};

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<ProductCategory>('Keyboard');
  const [price, setPrice] = useState<number>(1200000);
  const [originalPrice, setOriginalPrice] = useState<number>(1500000);
  const [stock, setStock] = useState<number>(30);
  const [weightKg, setWeightKg] = useState<number>(1.2);
  const [badge, setBadge] = useState<Product['badge']>('NEW');
  const [imageUrl, setImageUrl] = useState<string>(PRESET_IMAGES['Keyboard'][0]);
  const [description, setDescription] = useState<string>('Perangkat keras berkualitas tinggi dengan build quality anodized premium.');

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setOriginalPrice(productToEdit.originalPrice);
      setStock(productToEdit.stock);
      setWeightKg(productToEdit.weightKg);
      setBadge(productToEdit.badge || 'HOT');
      setImageUrl(productToEdit.image);
      setDescription(productToEdit.description);
    } else {
      setTitle('');
      setCategory('Keyboard');
      setPrice(1200000);
      setOriginalPrice(1500000);
      setStock(30);
      setWeightKg(1.2);
      setBadge('NEW');
      setImageUrl(PRESET_IMAGES['Keyboard'][0]);
      setDescription('Perangkat keras berkualitas tinggi dengan build quality anodized premium.');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const discountPercent = originalPrice > price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Nama produk wajib diisi!');
      return;
    }

    const products = StorageEngine.getProducts();

    if (productToEdit) {
      const updated = products.map((p) =>
        p.id === productToEdit.id
          ? {
              ...p,
              title,
              category,
              price: Number(price),
              originalPrice: Number(originalPrice),
              discountPercent,
              stock: Number(stock),
              weightKg: Number(weightKg),
              badge,
              image: imageUrl,
              description,
              isFlashSale: badge === 'FLASH SALE',
            }
          : p
      );
      StorageEngine.saveProducts(updated);
    } else {
      const newProduct: Product = {
        id: `prod-custom-${Date.now()}`,
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        category,
        price: Number(price),
        originalPrice: Number(originalPrice),
        discountPercent,
        rating: 5.0,
        reviewsCount: 1,
        badge,
        image: imageUrl,
        gallery: [imageUrl],
        stock: Number(stock),
        weightKg: Number(weightKg),
        specs: {
          Category: category,
          Condition: '100% Brand New',
          Warranty: 'Garansi Resmi 2 Tahun',
        },
        description,
        isFlashSale: badge === 'FLASH SALE',
      };
      products.unshift(newProduct);
      StorageEngine.saveProducts(products);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400">
            <PackagePlus className="h-5 w-5" />
            <h3 className="text-sm font-bold text-white">
              {productToEdit ? 'Edit Produk Toko' : 'Tambah Produk Baru ke Katalog'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="text-xs text-slate-400 font-medium">Nama Produk Lengkap</label>
            <input
              type="text"
              required
              placeholder="Contoh: Forge Apex Zenith 65% Custom Keyboard"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-medium">Kategori</label>
              <select
                value={category}
                onChange={(e) => {
                  const cat = e.target.value as ProductCategory;
                  setCategory(cat);
                  setImageUrl(PRESET_IMAGES[cat][0] || PRESET_IMAGES['Keyboard'][0]);
                }}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="Keyboard">Keyboard</option>
                <option value="Audio">Audio</option>
                <option value="Desk Setup">Desk Setup</option>
                <option value="Ergonomics">Ergonomics</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-medium">Promotional Badge</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
              >
                <option value="NEW">NEW</option>
                <option value="HOT">HOT</option>
                <option value="FLASH SALE">FLASH SALE</option>
                <option value="BESTSELLER">BESTSELLER</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-medium">Harga Asli (Rp)</label>
              <input
                type="number"
                required
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium">Harga Jual Diskon (Rp)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium">Diskon (%)</label>
              <div className="mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-cyan-400 font-mono">
                {discountPercent}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-medium">Stok Tersedia (Unit)</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium">Berat Barang (kg)</label>
              <input
                type="number"
                step="0.1"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium block mb-1.5">
              Pilihan Visual Gambar Produk (Klik Preset):
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(PRESET_IMAGES[category] || []).map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="preset"
                  onClick={() => setImageUrl(img)}
                  className={`w-14 h-14 rounded-lg object-cover cursor-pointer border-2 transition-all ${
                    imageUrl === img ? 'border-cyan-400 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
            <input
              type="text"
              placeholder="Atau masukkan URL gambar custom..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full mt-2 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-medium">Deskripsi Produk</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
            >
              {productToEdit ? 'Simpan Perubahan' : 'Tambahkan Produk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};