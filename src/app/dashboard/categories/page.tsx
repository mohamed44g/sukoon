import { categoriesApi } from '@/services/api';
import CategoryClient from './CategoryClient';

// هذه الدالة تجعل المكون Server Component افتراضياً في Next.js (App Router)
export default async function CategoriesPage() {
  let categories : any = [];

  try {
    // جلب البيانات من السيرفر مباشرة
    categories = await categoriesApi.getAll();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    // يمكنك التعامل مع الخطأ هنا، مثلاً عرض صفحة خطأ أو إرجاع مصفوفة فارغة
  }

  // تمرير البيانات إلى مكون العميل
  return <CategoryClient initialCategories={categories} />;
}