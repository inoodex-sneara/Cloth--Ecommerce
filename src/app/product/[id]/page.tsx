import ProductDetail from "@/components/ProductDetail";
import { getApiProductDetail } from "@/lib/api/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = (await getApiProductDetail(id))?.product;

  if (!product) {
    return { title: "Product Not Found — Loomora" };
  }

  return {
    title: `${product.name} — Loomora`,
    description: `Buy ${product.name} at Loomora. ${product.brand} • ৳${product.price}`,
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const fromApi = await getApiProductDetail(id);
  const product = fromApi?.product;
  if (!product) notFound();

  const price =
    typeof sp.price === "string" && !Number.isNaN(Number(sp.price))
      ? Number(sp.price)
      : undefined;
  const oldPrice =
    typeof sp.old === "string" && !Number.isNaN(Number(sp.old))
      ? Number(sp.old)
      : undefined;

  return (
    <ProductDetail
      product={product}
      related={fromApi?.related ?? []}
      price={price}
      oldPrice={oldPrice}
    />
  );
}
