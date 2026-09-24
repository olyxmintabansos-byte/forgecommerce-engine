================================================================================
HERMES MEGA-DIRECTIVE: FORGECOMMERCE - SPRINT 4 (FINAL SPRINT)
================================================================================
Role: Principal Systems Architect & Lead Engineer.
Target Directory: C:\Users\L480\AppData\Local\hermes\cache\scratch\forgecommerce-engine

CRITICAL PROTOCOLS:
1. ALWAYS use the `terminal` tool to run commands in PowerShell.
2. For pre-existing files, ALWAYS run `read_file` first before calling `write_file`.
3. ZERO PLACEHOLDERS: Write complete, typed TypeScript code with full interactive logic.
4. Execute all steps sequentially and compile with `npm run build`.

--------------------------------------------------------------------------------
FILE 1: src/lib/storage.ts
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\forgecommerce-engine\src\lib\storage.ts
--------------------------------------------------------------------------------
import { Product, CartItem, Order, VoucherCoupon, OrderShipment, FlashSaleSettings } from '@/types/commerce';
import { INITIAL_PRODUCTS, AVAILABLE_VOUCHERS } from './mock-products';

const STORAGE_KEYS = {
  PRODUCTS: 'forgecommerce_products_v1',
  CART: 'forgecommerce_cart_v1',
  ORDERS: 'forgecommerce_orders_v1',
  VOUCHERS: 'forgecommerce_vouchers_v1',
  FLASH_SALE: 'forgecommerce_flash_sale_v1',
};

const DEFAULT_FLASH_SALE: FlashSaleSettings = {
  title: 'Tingkatkan Stasiun Kerja Anda ke Level Tertinggi',
  subtitle: 'Perangkat keras pilihan arsitek dan insinyur piranti lunak. Keyboard mekanik gasket akustik creamy, standing desk dual-motor, dan audio presisi tinggi.',
  discountHeadline: 'Flash Sale Hari Ini',
  endsAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
};

export const StorageEngine = {
  getProducts(): Product[] {
    if (typeof window === 'undefined') return INITIAL_PRODUCTS;
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  saveProducts(products: Product[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event('forge_products_updated'));
  },

  deleteProduct(productId: string): void {
    const products = this.getProducts().filter((p) => p.id !== productId);
    this.saveProducts(products);
  },

  getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.CART);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveCart(cart: CartItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    window.dispatchEvent(new Event('forge_cart_updated'));
  },

  addToCart(product: Product, quantity = 1): void {
    const cart = this.getCart();
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    this.saveCart(cart);
  },

  updateCartQuantity(productId: string, quantity: number): void {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter((item) => item.product.id !== productId);
    } else {
      const target = cart.find((item) => item.product.id === productId);
      if (target) {
        target.quantity = quantity;
      }
    }
    this.saveCart(cart);
  },

  clearCart(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CART);
    window.dispatchEvent(new Event('forge_cart_updated'));
  },

  getOrders(): Order[] {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      const sampleOrders: Order[] = [
        {
          id: 'ord-demo-01',
          orderNumber: 'ORD-2026-9812',
          customerName: 'Bima Satria',
          customerPhone: '081288991122',
          customerEmail: 'bima.satria@forge.io',
          destinationCity: 'Kota Bandung',
          address: 'Jl. Riau No. 45, Citarum, Bandung Wetan',
          postalCode: '40115',
          items: [
            {
              productId: 'prod-01',
              title: 'Forge Apex Pro 75% Wireless Mechanical Keyboard',
              price: 1850000,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80',
              weightKg: 1.2,
            },
          ],
          subtotal: 1850000,
          voucherDiscount: 100000,
          voucherCode: 'HEMAT100K',
          shippingFee: 16000,
          totalAmount: 1766000,
          paymentMethod: 'BCA_VA',
          paymentStatus: 'PAID',
          paidAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          shipment: {
            courierName: 'JNE Express',
            service: 'Reguler (2-3 Hari)',
            trackingNumber: 'JP9823145621',
            shippingFee: 16000,
            status: 'PROCESSED',
            history: [
              {
                timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
                description: 'Pesanan telah dibayar via BCA Virtual Account',
                location: 'Payment Gateway Midtrans',
              },
              {
                timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
                description: 'Penjual sedang mengemas pesanan dengan bubble wrap ganda',
                location: 'Warehouse Hub Jakarta Selatan',
              },
            ],
          },
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(sampleOrders));
      return sampleOrders;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  },

  saveOrders(orders: Order[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('forge_orders_updated'));
  },

  updateOrderStatus(orderId: string, newStatus: OrderShipment['status'], logDescription?: string): void {
    const orders = this.getOrders();
    const target = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!target) return;

    target.shipment.status = newStatus;

    const defaultLogs: Record<OrderShipment['status'], { desc: string; loc: string }> = {
      PENDING: { desc: 'Menunggu konfirmasi pembayaran', loc: 'Payment Gateway' },
      PROCESSED: { desc: 'Penjual sedang mengemas barang di Gudang', loc: 'Gudang Jakarta Selatan' },
      SHIPPED: { desc: 'Paket diserahkan ke kurir & dalam perjalanan menuju Sorting Hub', loc: 'Hub Logistik Ekspedisi' },
      DELIVERED: { desc: 'Paket telah berhasil diterima oleh penerima / pihak keluarga', loc: target.destinationCity },
    };

    const log = defaultLogs[newStatus];
    target.shipment.history.unshift({
      timestamp: new Date().toISOString(),
      description: logDescription || log.desc,
      location: log.loc,
    });

    this.saveOrders(orders);
  },

  getFlashSaleSettings(): FlashSaleSettings {
    if (typeof window === 'undefined') return DEFAULT_FLASH_SALE;
    const raw = localStorage.getItem(STORAGE_KEYS.FLASH_SALE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FLASH_SALE, JSON.stringify(DEFAULT_FLASH_SALE));
      return DEFAULT_FLASH_SALE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_FLASH_SALE;
    }
  },

  saveFlashSaleSettings(settings: FlashSaleSettings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.FLASH_SALE, JSON.stringify(settings));
    window.dispatchEvent(new Event('forge_flash_sale_updated'));
  },

  getVouchers(): VoucherCoupon[] {
    return AVAILABLE_VOUCHERS;
  },

  resetAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.FLASH_SALE, JSON.stringify(DEFAULT_FLASH_SALE));
    localStorage.removeItem(STORAGE_KEYS.CART);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    window.location.reload();
  },
};

--------------------------------------------------------------------------------
FILE 2: src/components/seller/AddProductModal.tsx
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\forgecommerce-engine\src\components\seller\AddProductModal.tsx
--------------------------------------------------------------------------------
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

--------------------------------------------------------------------------------
FILE 3: src/components/seller/ProductManagerView.tsx
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\forgecommerce-engine\src\components\seller\ProductManagerView.tsx
--------------------------------------------------------------------------------
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

--------------------------------------------------------------------------------
FILE 4: src/components/seller/AnalyticsView.tsx
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\forgecommerce-engine\src\components\seller\AnalyticsView.tsx
--------------------------------------------------------------------------------
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

--------------------------------------------------------------------------------
FILE 5: src/components/seller/SellerCenterView.tsx
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\forgecommerce-engine\src\components\seller\SellerCenterView.tsx
--------------------------------------------------------------------------------
"use client";

import React, { useEffect, useState } from 'react';
import { 
  Printer, 
  Boxes
} from 'lucide-react';
import { StorageEngine } from '@/lib/storage';
import { Order } from '@/types/commerce';
import { ShippingLabelModal } from './ShippingLabelModal';
import { ProductManagerView } from './ProductManagerView';
import { AnalyticsView } from './AnalyticsView';

export const SellerCenterView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'products' | 'analytics'>('orders');
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

  const handlePackOrder = (orderId: string) => {
    StorageEngine.updateOrderStatus(orderId, 'PROCESSED', 'Pesanan telah selesai dikemas rapi dan siap dijemput kurir.');
  };

  const handlePickupCourier = (orderId: string) => {
    StorageEngine.updateOrderStatus(orderId, 'SHIPPED', 'Kurir telah melakukan pickup paket. Sedang transit di sorting hub.');
  };

  const handleCompleteOrder = (orderId: string) => {
    StorageEngine.updateOrderStatus(orderId, 'DELIVERED', 'Paket telah sampai di tujuan dan diterima pembeli.');
  };

  const countProcessed = orders.filter((o) => o.shipment.status === 'PROCESSED').length;
  const countShipped = orders.filter((o) => o.shipment.status === 'SHIPPED').length;
  const countDelivered = orders.filter((o) => o.shipment.status === 'DELIVERED').length;

  const filteredOrders = orders.filter((o) => {
    if (filterTab === 'ALL') return true;
    return o.shipment.status === filterTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Boxes className="h-4 w-4" />
            <span>Pusat Kendali Toko & Logistik</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Seller Center & Toko Merchant</h1>
        </div>

        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeSubTab === 'orders'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Daftar Pesanan ({orders.length})
          </button>
          <button
            onClick={() => setActiveSubTab('products')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeSubTab === 'products'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kelola Katalog Produk
          </button>
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeSubTab === 'analytics'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Laporan & Analitik
          </button>
        </div>
      </div>

      {activeSubTab === 'products' && <ProductManagerView />}

      {activeSubTab === 'analytics' && <AnalyticsView />}

      {activeSubTab === 'orders' && (
        <div className="space-y-6">
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
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-white">{ord.orderNumber}</div>
                          <div className="text-[10px] text-cyan-400">{ord.shipment.trackingNumber}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-200">{ord.customerName}</div>
                          <div className="text-[10px] text-slate-500">{ord.destinationCity}</div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-slate-300 truncate max-w-xs">
                            {ord.items[0]?.title} {ord.items.length > 1 && `+${ord.items.length - 1} lainnya`}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {ord.items.reduce((s, i) => s + i.quantity, 0)} pcs
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          Rp {ord.totalAmount.toLocaleString('id-ID')}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-300">{ord.shipment.courierName}</div>
                          <div className="text-[10px] text-slate-500">{ord.shipment.service}</div>
                        </td>

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

          <ShippingLabelModal
            isOpen={isLabelModalOpen}
            onClose={() => setIsLabelModalOpen(false)}
            order={selectedLabelOrder}
          />
        </div>
      )}
    </div>
  );
};

--------------------------------------------------------------------------------
FILE 6: src/components/storefront/ProductGrid.tsx
Path: C:\Users\L480\AppData\Local\hermes\cache\scratch\forgecommerce-engine\src\components\storefront\ProductGrid.tsx
--------------------------------------------------------------------------------
"use client";

import React, { useState } from 'react';
import { ArrowUpDown, Package } from 'lucide-react';
import { Product } from '@/types/commerce';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (p: Product) => void;
  selectedCategory: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  selectedCategory,
}) => {
  const [sortBy, setSortBy] = useState<'POPULAR' | 'CHEAPEST' | 'PRICIEST' | 'DISCOUNT'>('POPULAR');

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'CHEAPEST') return a.price - b.price;
    if (sortBy === 'PRICIEST') return b.price - a.price;
    if (sortBy === 'DISCOUNT') return b.discountPercent - a.discountPercent;
    return b.reviewsCount - a.reviewsCount;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Koleksi Hardware Terpilih</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-mono">
              {products.length} Barang
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {selectedCategory === 'ALL'
              ? 'Menampilkan seluruh katalog stasiun kerja premium'
              : `Menampilkan kategori: ${selectedCategory}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
          <span className="text-xs text-slate-400">Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="POPULAR">Paling Populer & Terlaris</option>
            <option value="CHEAPEST">Harga: Terendah ke Tertinggi</option>
            <option value="PRICIEST">Harga: Tertinggi ke Terendah</option>
            <option value="DISCOUNT">Diskon Terbesar</option>
          </select>
        </div>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 space-y-2">
          <Package className="h-10 w-10 mx-auto text-slate-700" />
          <p className="text-sm font-medium">Tidak ada produk yang cocok dengan pencarian Anda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

--------------------------------------------------------------------------------
STEP 2: TERMINAL COMPILATION & VERIFICATION
--------------------------------------------------------------------------------
Execute the following PowerShell commands in the terminal:

Set-Location "C:\Users\L480\AppData\Local\hermes\cache\scratch\forgecommerce-engine"
npm run build

--------------------------------------------------------------------------------
STEP 3: DEPLOY & FINAL COMMIT TO GITHUB
--------------------------------------------------------------------------------
Execute the following git command:

git add .
git commit -m "feat(forgecommerce): sprint 4 final complete catalog crud, flash sale sync & merchant analytics"
================================================================================
