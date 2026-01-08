import { analyticsApi } from '@/services/api';
import CustomersClient from './CustomersClient';
import { cookies } from 'next/headers';

export default async function CustomersPage() {
    const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  let initialData : any = [];

  try {
    // جلب بيانات الشهر الحالي افتراضياً عند تحميل الصفحة لأول مرة
    // يمكن تركها فارغة إذا كان الـ API يعالج التاريخ الافتراضي
    initialData = await analyticsApi.getCustomers(undefined, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }); 
  } catch (error) {
    console.error("Failed to fetch initial customers data", error);
  }

  return <CustomersClient initialData={initialData} />;
}