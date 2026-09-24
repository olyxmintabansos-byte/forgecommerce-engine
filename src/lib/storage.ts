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