import CatalogPageLayout from "@/components/CatalogPageLayout";
import { getProducts } from "@/lib/api/products";

export const metadata = {
  title: "Men's Fashion & Clothing — Loomora",
  description: "Shop trendy men's shirts, polo shirts, jeans, jackets, panjabi, and formal pants at Loomora.",
};

const topSubcategories = [
  "Mens Formal Pant",
  "Mens Sweatshirt",
  "Mens Biker Jacket",
  "Mens Lungi",
  "Mens Overcoat",
  "Mens Vest",
  "Mens Katua & Fatua",
  "Mens Polo",
  "Mens Jeans Pant",
  "Mens T-Shirt",
  "Mens Jacket",
  "Clothing & Fashion",
];

const categories = [
  "Mens Jeans Pant",
  "Mens Polo",
  "Mens Formal Shirt",
  "Mens Shorts",
  "Mens T-Shirt",
  "Mens Hoodie",
  "Mens Coti",
  "Mens Joggers",
  "Mens Jersey",
  "Mens Chino Pant",
  "Mens Jacket",
  "Mens Innerwear",
];

const brands = ["DHEU", "Loomora", "Loomora Signature"];

export default async function MenPage() {
  const api = await getProducts({ category: "men", per_page: 100 });
  const products = api?.products ?? [];

  return (
    <CatalogPageLayout
      title="Mens"
      topSubcategories={topSubcategories}
      categories={categories}
      brands={brands}
      products={products}
    />
  );
}
