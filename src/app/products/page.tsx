import { productsApi } from "@/services/api";
import OffersPageClient  from "./pageClient"; // افترضت إن عندك Client Component للعرض زي ما عملنا في الصفحة الرئيسية

// 1. تعريف نوع الـ Props
interface ProductPageProps {
  params: {
    productId: string; // الرابط بيرجع سترينج دائماً
  };
}

const OffersPage = async () => {

  // يفضل استخدام try-catch هنا عشان لو الـ ID غلط ميعملش Crash
  let products = null;
  try {
     products = await productsApi.getAll();
  } catch (error) {
     console.error("Product not found");
  }

  if (!products) {
    return <div>المنتج غير موجود</div>;
  }

  // 5. تمرير البيانات للـ Client Component
  return <OffersPageClient products={products}/>;
};

export default OffersPage;