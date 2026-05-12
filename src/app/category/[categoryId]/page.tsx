import { productsApi } from "@/services/api";
import CategoryPageClient from "./pageClient";

const CategoryPage = async ({ params }: { params: any }) => {
  const { categoryId } = await params;
  const id = parseInt(categoryId);

  let initialProducts: any = [];
  try {
    // جلب أول 8 منتجات للفئة
    initialProducts = await productsApi.getProductsByCategory(id, 1);
  } catch (error) {
    console.error("Failed to fetch category products");
  }

  return <CategoryPageClient initialProducts={initialProducts || []} categoryId={id} />;
};

export default CategoryPage;