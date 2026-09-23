"use client";

import React, { useEffect, useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Building2, 
  QrCode, 
  Smartphone,
  AlertCircle
} from 'lucide-react';
import { PaymentMethodType } from '@/types/commerce';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  totalAmount: number;
  paymentMethod: PaymentMethodType;
  onSimulateSuccess: () => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  totalAmount,
  paymentMethod,
  onSimulateSuccess,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(900); // 15:00 minutes

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  // Generate deterministic VA based on order
  const getVANumber = (): string => {
    if (paymentMethod === 'BCA_VA') return '8808 1928 3746 5521';
    if (paymentMethod === 'MANDIRI_VA') return '8902 4492 1083 9102';
    if (paymentMethod === 'BRI_VA') return '7701 5592 3819 0041';
    return '9901 0812 3456 7890';
  };

  const vaNumber = getVANumber();

  const handleCopy = () => {
    navigator.clipboard.writeText(vaNumber.replace(/\s+/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const isVA = paymentMethod.includes('_VA');
  const isQRIS = paymentMethod === 'QRIS';
  const isEWallet = paymentMethod === 'GOPAY' || paymentMethod === 'SHOPEEPAY';

  const formatTimer = () => {
    const mins = Math.floor(countdown / 60);
    const secs = countdown % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Gateway Header ala Midtrans/Xendit */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">ForgePay Secure Gateway</h3>
              <p className="text-[10px] text-slate-400 font-mono">Invoice: {orderNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Amount & Expiry Timer Banner */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/60 border-b border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400">Total Pembayaran:</span>
            <div className="text-2xl font-black text-cyan-400 font-mono">
              Rp {totalAmount.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium justify-end">
              <Clock className="h-3.5 w-3.5" />
              <span>Selesaikan Dalam</span>
            </div>
            <div className="font-mono text-base font-bold text-white">
              {formatTimer()}
            </div>
          </div>
        </div>

        {/* Content Body Based on Method */}
        <div className="p-6 space-y-5">
          {/* VIRTUAL ACCOUNT MODE */}
          {isVA && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Nomor Virtual Account ({paymentMethod.replace('_', ' ')})</span>
                  <Building2 className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="font-mono text-lg font-black text-white tracking-widest">
                    {vaNumber}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Tersalin!' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-1.5 pl-1">
                <p className="font-semibold text-slate-300">Petunjuk Pembayaran ATM / M-Banking:</p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-400">
                  <li>Buka aplikasi m-Banking atau kunjungi ATM terdekat.</li>
                  <li>Pilih menu <strong>Transfer &gt; Virtual Account</strong>.</li>
                  <li>Masukkan nomor VA di atas dan konfirmasi nominal tagihan.</li>
                  <li>Transaksi akan otomatis terverifikasi tanpa upload struk.</li>
                </ol>
              </div>
            </div>
          )}

          {/* QRIS INTERACTIVE MODE */}
          {isQRIS && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-200">
                <svg viewBox="0 0 100 100" className="w-44 h-44">
                  <rect width="100" height="100" fill="white" />
                  <rect x="8" y="8" width="28" height="28" fill="#020617" />
                  <rect x="13" y="13" width="18" height="18" fill="white" />
                  <rect x="17" y="17" width="10" height="10" fill="#020617" />
                  <rect x="64" y="8" width="28" height="28" fill="#020617" />
                  <rect x="69" y="13" width="18" height="18" fill="white" />
                  <rect x="73" y="17" width="10" height="10" fill="#020617" />
                  <rect x="8" y="64" width="28" height="28" fill="#020617" />
                  <rect x="13" y="69" width="18" height="18" fill="white" />
                  <rect x="17" y="73" width="10" height="10" fill="#020617" />
                  <circle cx="45" cy="18" r="3" fill="#020617" />
                  <circle cx="52" cy="30" r="3.5" fill="#020617" />
                  <circle cx="48" cy="50" r="4.5" fill="#020617" />
                  <circle cx="68" cy="52" r="3" fill="#020617" />
                  <circle cx="45" cy="72" r="3" fill="#020617" />
                  <circle cx="78" cy="78" r="3.5" fill="#020617" />
                  <circle cx="85" cy="62" r="3" fill="#020617" />
                </svg>
              </div>

              <div className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Scan kode QRIS menggunakan kamera HP Anda di aplikasi <strong>BCA, Livin, GoPay, OVO, atau ShopeePay</strong>.
              </div>
            </div>
          )}

          {/* E-WALLET MODE */}
          {isEWallet && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
              <Smartphone className="h-10 w-10 text-cyan-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Pembayaran via {paymentMethod}</h4>
              <p className="text-xs text-slate-400">
                Aplikasi e-Wallet Anda akan menerima permintaan otorisasi pembayaran sebesar <strong>Rp {totalAmount.toLocaleString('id-ID')}</strong>.
              </p>
            </div>
          )}

          {/* Instant Sandbox Simulator Button */}
          <div className="pt-2">
            <button
              onClick={onSimulateSuccess}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all active:scale-95"
            >
              <Zap className="h-4 w-4 fill-slate-950" />
              <span>[ ⚡ SIMULASIKAN PEMBAYARAN BERHASIL ]</span>
            </button>
            <p className="text-[10px] text-slate-500 text-center mt-2">
              Klik tombol simulator untuk memicu webhook status pelunasan LUNAS seketika tanpa transfer riil.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
