export interface Governorate {
  name: string;
  shippingCost: number;
}

export const egyptGovernorates: Governorate[] = [
  { name: 'القاهرة', shippingCost: 50 },
  { name: 'الجيزة', shippingCost: 50 },
  { name: 'الإسكندرية', shippingCost: 60 },
  { name: 'الدقهلية', shippingCost: 65 },
  { name: 'البحر الأحمر', shippingCost: 100 },
  { name: 'البحيرة', shippingCost: 70 },
  { name: 'الفيوم', shippingCost: 65 },
  { name: 'الغربية', shippingCost: 65 },
  { name: 'الإسماعيلية', shippingCost: 70 },
  { name: 'المنوفية', shippingCost: 60 },
  { name: 'المنيا', shippingCost: 80 },
  { name: 'القليوبية', shippingCost: 55 },
  { name: 'الوادي الجديد', shippingCost: 120 },
  { name: 'السويس', shippingCost: 70 },
  { name: 'أسوان', shippingCost: 100 },
  { name: 'أسيوط', shippingCost: 85 },
  { name: 'بني سويف', shippingCost: 75 },
  { name: 'بورسعيد', shippingCost: 75 },
  { name: 'دمياط', shippingCost: 70 },
  { name: 'الشرقية', shippingCost: 60 },
  { name: 'جنوب سيناء', shippingCost: 110 },
  { name: 'كفر الشيخ', shippingCost: 70 },
  { name: 'مطروح', shippingCost: 100 },
  { name: 'الأقصر', shippingCost: 95 },
  { name: 'قنا', shippingCost: 90 },
  { name: 'شمال سيناء', shippingCost: 110 },
  { name: 'سوهاج', shippingCost: 85 },
];

export const getShippingCost = (governorateName: string): number => {
  const gov = egyptGovernorates.find((g) => g.name === governorateName);
  return gov?.shippingCost ?? 0;
};
