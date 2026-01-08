import { cookies } from 'next/headers';
import { analyticsApi } from '@/services/api'; // تأكد من المسار الصحيح
import DashboardClient from './DashboardClient'; // المكون الجديد اللي هنعمله تحت

const DashboardPage = async () => {
  // 1. استخراج التوكن من الكوكيز عشان نبعته للباك اند
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  let dashboardData = null;

  try {
    // 2. جلب البيانات من السيرفر
    dashboardData = await analyticsApi.getDashboard({
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error("Failed to fetch dashboard data", error);
    // ممكن هندلة الخطأ هنا أو نبعت داتا فاضية
  }

  // 3. عرض المكون الكلاينت وتمرير البيانات له
  return <DashboardClient initialData={dashboardData} />;
};

export default DashboardPage;