import CatalogPageLayout from "@/components/CatalogPageLayout";
import { getProducts } from "@/lib/api/products";

export const metadata = {
  title: "New In — Loomora",
  description:
    "Discover the latest arrivals at Loomora — new shirts, sarees, kurti sets, jackets, kids wear and more.",
};

const topSubcategories = [
  "Mens Polo",
  "Mens Jeans Pant",
  "Mens Jacket",
  "Mens Formal Shirt",
  "Womens Kurti",
  "Womens Saree",
  "Womens 2 Pcs Set",
  "Womens Tops",
  "Girls Frock",
  "Kids Winter Wear",
  "Kids Jacket",
];

const categories = [
  "Mens Polo",
  "Mens Jeans Pant",
  "Mens Jacket",
  "Mens Formal Shirt",
  "Mens Hoodie",
  "Womens Kurti",
  "Womens Saree",
  "Womens 2 Pcs Set",
  "Womens Tops",
  "Boys Polo",
  "Girls Frock",
  "Kids Winter Wear",
  "Kids Jacket",
  "Kids Sweatshirt",
];

const brands = [
  "Loomora",
  "DHEU",
  "Loomora Signature",
  "Loomora Women",
  "Loomora Kids",
];

export default async function NewInPage() {
  const api = await getProducts({ badge: "new_arrival", per_page: 100 });
  const products = api?.products ?? [];

  return (
    <CatalogPageLayout
      title="New In"
      topSubcategories={topSubcategories}
      categories={categories}
      brands={brands}
      products={products}
    />
  );
}
