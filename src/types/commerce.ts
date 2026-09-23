export type ProductCategory = 'Keyboard' | 'Audio' | 'Desk Setup' | 'Ergonomics' | 'Accessories';

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewsCount: number;
  badge?: 'HOT' | 'FLASH SALE' | 'NEW' | 'BESTSELLER';
  image: string;
  gallery: string[];
  stock: number;
  weightKg: number;
  specs: Record<string, string>;
  description: string;
  isFlashSale?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface VoucherCoupon {
  code: string;
  description: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minSpend: number;
}

export interface DestinationCity {
  id: string;
  name: string;
  province: string;
  zone: 'JABODETABEK' | 'JAWA' | 'LUAR_JAWA';
}

export interface ShippingOption {
  id: string;
  courierCode: 'JNE' | 'JNT' | 'SICEPAT' | 'GOSEND';
  courierName: string;
  serviceName: string;
  etd: string;
  cost: number;
}

export type PaymentMethodType = 'BCA_VA' | 'MANDIRI_VA' | 'BRI_VA' | 'QRIS' | 'GOPAY' | 'SHOPEEPAY';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  weightKg: number;
}

export interface OrderShipment {
  courierName: string;
  service: string;
  trackingNumber: string;
  shippingFee: number;
  status: 'PENDING' | 'PROCESSED' | 'SHIPPED' | 'DELIVERED';
  history: {
    timestamp: string;
    description: string;
    location: string;
  }[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  destinationCity: string;
  address: string;
  postalCode: string;
  items: OrderItem[];
  subtotal: number;
  voucherDiscount: number;
  voucherCode?: string;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  paymentStatus: 'UNPAID' | 'PAID';
  vaNumber?: string;
  paidAt?: string;
  shipment: OrderShipment;
  createdAt: string;
}
