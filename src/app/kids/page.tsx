import CatalogPageLayout from "@/components/CatalogPageLayout";
import { getProducts } from "@/lib/api/products";

export const metadata = {
  title: "Kids Fashion & Clothing — Loomora",
  description: "Shop trendy boys polo shirts, t-shirts, panjabi, girls frocks, kurti sets, and kids winter wear at Loomora.",
};

const topSubcategories = [
  "Boys Polo",
  "Boys T-Shirt",
  "Boys Panjabi",
  "Boys Denim",
  "Girls Frock",
  "Girls Kurti",
  "Girls Tops",
  "Infants 2 Pcs",
  "Kids Winter Wear",
  "Clothing & Fashion",
];

const categories = [
  "Boys Polo",
  "Boys T-Shirt",
  "Boys Panjabi",
  "Boys Jeans Pant",
  "Girls Frock",
  "Girls Kurti Set",
  "Girls Tops",
  "Infant Wear",
  "Kids Jacket",
  "Kids Sweatshirt",
  "Kids Winter Wear",
];

const brands = ["Loomora Kids", "DHEU Junior"];

export default async function KidsPage() {
  const api = await getProducts({ category: "kids", per_page: 100 });
  const products = api?.products ?? [];

  return (
    <CatalogPageLayout
      title="Kids"
      topSubcategories={topSubcategories}
      categories={categories}
      brands={brands}
      products={products}
    />
  );
}
