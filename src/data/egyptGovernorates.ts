export interface Governorate {
  name: string;
  shippingCost: number;
}

export const egyptGovernorates = [
  { name: 'القاهرة', shippingCost: 70 },
  { name: 'الجيزة', shippingCost: 70 },
  { name: 'الإسكندرية', shippingCost: 70 },
  { name: 'البحيرة', shippingCost: 60 },
  { name: 'القليوبية', shippingCost: 70 },
  { name: 'الغربية', shippingCost: 60 },
  { name: 'المنوفية', shippingCost: 70 },
  { name: 'دمياط', shippingCost: 70 },
  { name: 'الدقهلية', shippingCost: 70 },
  { name: 'كفر الشيخ', shippingCost: 60 },
  { name: 'مطروح', shippingCost: 110 },
  { name: 'الإسماعيلية', shippingCost: 70 },
  { name: 'السويس', shippingCost: 80 },
  { name: 'بورسعيد', shippingCost: 80 },
  { name: 'الشرقية', shippingCost: 70 },
  { name: 'الفيوم', shippingCost: 80 },
  { name: 'بني سويف', shippingCost: 80 },
  { name: 'المنيا', shippingCost: 110 },
  { name: 'أسيوط', shippingCost: 110 },
  { name: 'سوهاج', shippingCost: 110 },
  { name: 'قنا', shippingCost: 120 },
  { name: 'أسوان', shippingCost: 120 },
  { name: 'الأقصر', shippingCost: 120 },
  { name: 'البحر الأحمر', shippingCost: 120 },
  { name: 'الوادي الجديد', shippingCost: 120 },
  { name: 'شمال سيناء', shippingCost: 90 },
  { name: 'جنوب سيناء', shippingCost: 115 },
];

export const getShippingCost = (governorateName: string): number => {
  const gov = egyptGovernorates.find((g) => g.name === governorateName);
  return gov?.shippingCost ?? 0;
};
