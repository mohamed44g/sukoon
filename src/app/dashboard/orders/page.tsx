
import { ordersApi } from '@/services/api';
import OrdersClient from './OrdersClient';
import { cookies } from 'next/headers';

export default async function OrdersPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
  let orders : any= [];

  try {
    // جلب جميع الطلبات من السيرفر
    // ملاحظة: لو عندك داتا كتير جداً، يفضل تعمل Pagination في الـ API
    // أو تبعت parameters للشهر من هنا لو الـ API بيدعم الفلترة بالسيرفر
    orders = await ordersApi.getAll(undefined, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }

  // تمرير الطلبات للمكون التفاعلي
  return <OrdersClient initialOrders={orders} />;
}