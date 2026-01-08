import { productsApi } from "@/services/api";
import ProductPageClient  from "./pageClient"; // افترضت إن عندك Client Component للعرض زي ما عملنا في الصفحة الرئيسية

// 1. تعريف نوع الـ Props
interface ProductPageProps {
  params: {
    productId: string; // الرابط بيرجع سترينج دائماً
  };
}

const ProductPage = async ({ params } : {params : any}) => {
  // 2. استخراج الـ ID
  // ملحوظة: في Next.js 15، الـ params قد تصبح Promise، لكن حالياً هذا هو الشكل القياسي
  const { productId } = await params;
  console.log("params", params)

  // 3. تحويله لرقم (لأن الـ API يتوقع number)
  const id = parseInt(productId);

  // 4. جلب البيانات
  // يفضل استخدام try-catch هنا عشان لو الـ ID غلط ميعملش Crash
  let product = null;
  try {
     product = await productsApi.getById(id);
  } catch (error) {
     console.error("Product not found");
  }

  if (!product) {
    return <div>المنتج غير موجود</div>;
  }

  // 5. تمرير البيانات للـ Client Component
  return <ProductPageClient product={product} related = {product.relatedProducts}/>;
};

export default ProductPage;