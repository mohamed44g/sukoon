import { productsApi } from "@/services/api";
import OffersPageClient from "./pageClient";

const OffersPage = async () => {
  let initialProducts : any= [];
  try {
    // جلب أول 8 عروض
    initialProducts = await productsApi.getOffers(1);
  } catch (error) {
    console.error("Offers fetch error");
  }

  return <OffersPageClient initialProducts={initialProducts || []} />;
};

export default OffersPage;