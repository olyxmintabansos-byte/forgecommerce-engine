"use client";

import React, { useState, useMemo } from 'react';
import { 
  X, 
  MapPin, 
  Truck, 
  CreditCard, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Building2,
  QrCode,
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { CartItem, VoucherCoupon, ShippingOption, PaymentMethodType, Order } from '@/types/commerce';
import { DESTINATION_CITIES, ShippingRateEngine } from '@/lib/shipping-calculator';
import { PaymentGatewayModal } from './PaymentGatewayModal';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedVoucher: VoucherCoupon | null;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  appliedVoucher,
  onOrderSuccess,
}) => {
  // Step 1: Customer & Address State
  const [customerName, setCustomerName] = useState<string>('Alex Pratama');
  const [customerPhone, setCustomerPhone] = useState<string>('081298765432');
  const [customerEmail, setCustomerEmail] = useState<string>('alex.pratama@dev.io');
  const [selectedCityId, setSelectedCityId] = useState<string>(DESTINATION_CITIES[0].id);
  const [address, setAddress] = useState<string>('Jl. Senopati No. 88, Kebayoran Baru');
  const [postalCode, setPostalCode] = useState<string>('12190');

  // Step 2: Shipping State
  const totalWeightKg = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.weightKg || 1) * item.quantity, 0);
  }, [cart]);

  const shippingOptions: ShippingOption[] = useMemo(() => {
    return ShippingRateEngine.calculateOptions(selectedCityId, totalWeightKg);
  }, [selectedCityId, totalWeightKg]);

  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(shippingOptions[0]);

  // Sync selected shipping if city changes
  React.useEffect(() => {
    if (shippingOptions.length > 0) {
      setSelectedShipping(shippingOptions[0]);
    }
  }, [selectedCityId]);

  // Step 3: Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('BCA_VA');
  const [isGatewayOpen, setIsGatewayOpen] = useState<boolean>(false);

  if (!isOpen) return null;

  // Price Computations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const calculateDiscount = (): number => {
    if (!appliedVoucher) return 0;
    if (subtotal < appliedVoucher.minSpend) return 0;
    if (appliedVoucher.discountType === 'PERCENT') {
      return Math.min((subtotal * appliedVoucher.discountValue) / 100, 200000);
    }
    return appliedVoucher.discountValue;
  };

  const discountAmount = calculateDiscount();
  const shippingFee = selectedShipping ? selectedShipping.cost : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount) + shippingFee;

  const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleOpenGateway = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !address) {
      alert('Harap lengkapi informasi nama, telepon, dan alamat pengiriman!');
      return;
    }
    setIsGatewayOpen(true);
  };

  const handleCompleteTransaction = () => {
    const targetCity = DESTINATION_CITIES.find((c) => c.id === selectedCityId)?.name || 'Jakarta';
    const trackingNumber = `JP${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName,
      customerPhone,
      customerEmail,
      destinationCity: targetCity,
      address,
      postalCode,
      items: cart.map((i) => ({
        productId: i.product.id,
        title: i.product.title,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image,
        weightKg: i.product.weightKg || 1,
      })),
      subtotal,
      voucherDiscount: discountAmount,
      voucherCode: appliedVoucher?.code,
      shippingFee,
      totalAmount: grandTotal,
      paymentMethod,
      paymentStatus: 'PAID',
      paidAt: new Date().toISOString(),
      shipment: {
        courierName: selectedShipping.courierName,
        service: selectedShipping.serviceName,
        trackingNumber,
        shippingFee,
        status: 'PROCESSED',
        history: [
          {
            timestamp: new Date().toISOString(),
            description: 'Pesanan telah lunas & sedang disiapkan di Gudang Utama Jakarta',
            location: 'Warehouse Hub Jakarta Selatan',
          },
        ],
      },
      createdAt: new Date().toISOString(),
    };

    setIsGatewayOpen(false);
    onClose();
    onOrderSuccess(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Checkout Pengiriman & Pembayaran</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Checkout Main Form */}
        <form onSubmit={handleOpenGateway} className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Form: Receiver, Shipping, Payment */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Info Penerima */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <MapPin className="h-4 w-4" />
                <span>1. Alamat Pengiriman & Penerima</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400">Nama Penerima</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">No. WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400">Kota Tujuan</label>
                  <select
                    value={selectedCityId}
                    onChange={(e) => setSelectedCityId(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  >
                    {DESTINATION_CITIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.province})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400">Kode Pos</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400">Alamat Lengkap (Jalan, No. Rumah, RT/RW)</label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Step 2: Shipping Rate Engine Options */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  <Truck className="h-4 w-4" />
                  <span>2. Pilihan Ekspedisi Kurir</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  Total Berat: <strong>{totalWeightKg.toFixed(1)} kg</strong>
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {shippingOptions.map((opt) => {
                  const isSelected = selectedShipping?.id === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedShipping(opt)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-950/70 border-cyan-500 shadow-md'
                          : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">
                            {opt.courierName} - <span className="text-cyan-300">{opt.serviceName}</span>
                          </p>
                          <p className="text-[11px] text-slate-400">Estimasi Tiba: {opt.etd}</p>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-white">
                        Rp {opt.cost.toLocaleString('id-ID')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <CreditCard className="h-4 w-4" />
                <span>3. Kanal Pembayaran</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {[
                  { id: 'BCA_VA', label: 'BCA VA', icon: <Building2 className="h-4 w-4 text-cyan-400" /> },
                  { id: 'MANDIRI_VA', label: 'Mandiri VA', icon: <Building2 className="h-4 w-4 text-amber-400" /> },
                  { id: 'BRI_VA', label: 'BRI VA', icon: <Building2 className="h-4 w-4 text-indigo-400" /> },
                  { id: 'QRIS', label: 'QRIS Dinamis', icon: <QrCode className="h-4 w-4 text-emerald-400" /> },
                  { id: 'GOPAY', label: 'GoPay', icon: <Smartphone className="h-4 w-4 text-sky-400" /> },
                  { id: 'SHOPEEPAY', label: 'ShopeePay', icon: <Smartphone className="h-4 w-4 text-orange-400" /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPaymentMethod(item.id as PaymentMethodType)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      paymentMethod === item.id
                        ? 'bg-slate-800 border-cyan-400 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.icon}
                    <span className="text-[11px] font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary Sticky Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 sticky top-0">
              <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
                Ringkasan Pesanan ({cart.reduce((s, i) => s + i.quantity, 0)} Item)
              </h3>

              {/* Items Mini List */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-2.5 items-center text-xs">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 font-semibold truncate">{item.product.title}</p>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {item.quantity} x Rp {item.product.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal Belanja:</span>
                  <span className="text-white font-mono">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-cyan-400">
                    <span>Diskon Voucher ({appliedVoucher?.code}):</span>
                    <span className="font-mono">- Rp {discountAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Ongkir ({selectedShipping?.courierName}):</span>
                  <span className="text-white font-mono">Rp {shippingFee.toLocaleString('id-ID')}</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                  <span>Total Tagihan:</span>
                  <span className="text-cyan-400 font-mono text-base">
                    Rp {grandTotal.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/25 transition-all"
              >
                <span>Bayar Sekarang</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Transaksi Terenkripsi 256-Bit SSL</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Payment Gateway Sandbox Modal */}
      <PaymentGatewayModal
        isOpen={isGatewayOpen}
        onClose={() => setIsGatewayOpen(false)}
        orderNumber={orderNumber}
        totalAmount={grandTotal}
        paymentMethod={paymentMethod}
        onSimulateSuccess={handleCompleteTransaction}
      />
    </div>
  );
};
