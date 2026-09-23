import { DestinationCity, ShippingOption } from '@/types/commerce';

export const DESTINATION_CITIES: DestinationCity[] = [
  { id: 'city-jkt', name: 'Jakarta Selatan', province: 'DKI Jakarta', zone: 'JABODETABEK' },
  { id: 'city-tng', name: 'Tangerang Selatan', province: 'Banten', zone: 'JABODETABEK' },
  { id: 'city-bks', name: 'Kota Bekasi', province: 'Jawa Barat', zone: 'JABODETABEK' },
  { id: 'city-bdg', name: 'Kota Bandung', province: 'Jawa Barat', zone: 'JAWA' },
  { id: 'city-smg', name: 'Kota Semarang', province: 'Jawa Tengah', zone: 'JAWA' },
  { id: 'city-sby', name: 'Kota Surabaya', province: 'Jawa Timur', zone: 'JAWA' },
  { id: 'city-yog', name: 'DI Yogyakarta', province: 'DI Yogyakarta', zone: 'JAWA' },
  { id: 'city-dps', name: 'Kota Denpasar', province: 'Bali', zone: 'LUAR_JAWA' },
  { id: 'city-mdn', name: 'Kota Medan', province: 'Sumatera Utara', zone: 'LUAR_JAWA' },
  { id: 'city-mks', name: 'Kota Makassar', province: 'Sulawesi Selatan', zone: 'LUAR_JAWA' },
  { id: 'city-plm', name: 'Kota Palembang', province: 'Sumatera Selatan', zone: 'LUAR_JAWA' },
];

export const ShippingRateEngine = {
  calculateOptions(cityId: string, totalWeightKg: number): ShippingOption[] {
    const city = DESTINATION_CITIES.find((c) => c.id === cityId) || DESTINATION_CITIES[0];
    const weightBillable = Math.max(1, Math.ceil(totalWeightKg));

    const options: ShippingOption[] = [];

    if (city.zone === 'JABODETABEK') {
      options.push(
        {
          id: 'opt-jne-reg',
          courierCode: 'JNE',
          courierName: 'JNE Express',
          serviceName: 'Reguler (2-3 Hari)',
          etd: '2-3 Hari',
          cost: 10000 * weightBillable,
        },
        {
          id: 'opt-jne-yes',
          courierCode: 'JNE',
          courierName: 'JNE Express',
          serviceName: 'YES - Yakin Esok Sampai',
          etd: '1 Hari (Besok)',
          cost: 20000 * weightBillable,
        },
        {
          id: 'opt-jnt-std',
          courierCode: 'JNT',
          courierName: 'J&T Express',
          serviceName: 'EZ Reguler (1-2 Hari)',
          etd: '1-2 Hari',
          cost: 11000 * weightBillable,
        },
        {
          id: 'opt-sicepat-best',
          courierCode: 'SICEPAT',
          courierName: 'SiCepat Ekspres',
          serviceName: 'BEST (Besok Sampai)',
          etd: '1 Hari',
          cost: 18000 * weightBillable,
        },
        {
          id: 'opt-gosend-instant',
          courierCode: 'GOSEND',
          courierName: 'GoSend / GrabExpress',
          serviceName: 'Instant Delivery (3 Jam Tiba)',
          etd: '3-4 Jam',
          cost: 35000, // Flat rate Jabodetabek
        }
      );
    } else if (city.zone === 'JAWA') {
      options.push(
        {
          id: 'opt-jne-reg',
          courierCode: 'JNE',
          courierName: 'JNE Express',
          serviceName: 'Reguler (2-3 Hari)',
          etd: '2-3 Hari',
          cost: 16000 * weightBillable,
        },
        {
          id: 'opt-jne-yes',
          courierCode: 'JNE',
          courierName: 'JNE Express',
          serviceName: 'YES - Yakin Esok Sampai',
          etd: '1 Hari',
          cost: 30000 * weightBillable,
        },
        {
          id: 'opt-jnt-std',
          courierCode: 'JNT',
          courierName: 'J&T Express',
          serviceName: 'EZ Reguler (2-3 Hari)',
          etd: '2-3 Hari',
          cost: 17000 * weightBillable,
        },
        {
          id: 'opt-sicepat-best',
          courierCode: 'SICEPAT',
          courierName: 'SiCepat Ekspres',
          serviceName: 'BEST (Besok Sampai)',
          etd: '1 Hari',
          cost: 28000 * weightBillable,
        }
      );
    } else {
      // LUAR JAWA
      options.push(
        {
          id: 'opt-jne-reg',
          courierCode: 'JNE',
          courierName: 'JNE Express',
          serviceName: 'Reguler Luar Pulau (3-5 Hari)',
          etd: '3-5 Hari',
          cost: 38000 * weightBillable,
        },
        {
          id: 'opt-jnt-std',
          courierCode: 'JNT',
          courierName: 'J&T Express',
          serviceName: 'EZ Antarpulau (3-4 Hari)',
          etd: '3-4 Hari',
          cost: 40000 * weightBillable,
        },
        {
          id: 'opt-sicepat-best',
          courierCode: 'SICEPAT',
          courierName: 'SiCepat Cargo / Best',
          serviceName: 'BEST Antarpulau (2-3 Hari)',
          etd: '2-3 Hari',
          cost: 45000 * weightBillable,
        }
      );
    }

    return options;
  },
};
