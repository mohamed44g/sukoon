import { categoriesApi, productsApi } from "@/services/api";
import PageClient from "./pageClient";


const Main = async () => {
  let latestProducts : any = [];
  let categories : any = [];
  let offers : any = []
  
  try {
    latestProducts = await productsApi.getLatest();
    categories = await categoriesApi.getAll()
    offers = await productsApi.getLatestOffers()
  } catch (error) {
    console.error("Failed to fetch latest products:", error);
    // ممكن تخليها مصفوفة فاضية عشان الموقع يفتح حتى لو مفيش منتجات
  }
  return <PageClient products={latestProducts} categories = {categories} offers = {offers}/>
};

export default Main;
