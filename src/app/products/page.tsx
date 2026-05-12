import { productsApi } from "@/services/api";
import ProductsPageClient from "./pageClient";

const ProductsPage = async () => {
  let initialProducts: any = [];
  try {
    // جلب الصفحة الأولى (أول 8 منتجات)
    initialProducts = await productsApi.getAll(1);
  } catch (error) {
    console.error("Failed to fetch products");
  }

  return <ProductsPageClient initialProducts={initialProducts || []} />;
};

export default ProductsPage;