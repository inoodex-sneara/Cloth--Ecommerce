"use client";

import { useEffect, useState } from "react";
import type { CatalogProduct } from "@/components/CatalogPageLayout";
import { ProductCard } from "@/components/ProductCard";
import { getApiProductDetail } from "@/lib/api/products";
import { HeartOff } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/providers/WishlistProvider";

export default function WishlistPage() {
  const { ids, remove } = useWishlist();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    Promise.all(
      ids.map((id) =>
        getApiProductDetail(id)
          .then((res) => res?.product ?? null)
          .catch(() => null)
      )
    ).then((list) => {
      if (!controller.signal.aborted) {
        setProducts(list.filter((p): p is CatalogProduct => p !== null));
        setLoading(false);
      }
    });
    return () => controller.abort();
  }, [ids]);

  return (
    <div className="w-full bg-white">
      <nav className="flex items-center gap-1.5 px-4 py-4 text-sm text-zinc-500">
        <Link href="/" className="transition-colors hover:text-[#12509b]">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-zinc-800">Wishlist</span>
      </nav>

      <div className="px-4 pb-12">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-3xl font-black text-zinc-900">My Wishlist</h1>
          <p className="text-sm text-zinc-500">
            <b className="text-zinc-900">{products.length}</b> item
            {products.length === 1 ? "" : "s"} saved
          </p>
        </div>

        {loading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ids.map((id) => (
              <div
                key={id}
                className="aspect-[3/4] animate-pulse rounded-xl bg-zinc-100"
              />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
                <button
                  type="button"
                  onClick={() => remove(product.id)}
                  aria-label={`Remove ${product.name} from wishlist`}
                  className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-500 shadow-sm transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <span aria-hidden className="text-lg leading-none">
                    ×
                  </span>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-zinc-200 bg-[#f7f8fc] p-10 text-center">
            <HeartOff className="mx-auto h-10 w-10 text-zinc-400" />
            <h2 className="mt-4 text-lg font-bold text-zinc-900">
              Wishlist e ekhono kichhu nai
            </h2>
            <p className="mt-1.5 text-sm text-zinc-500">
              Product gular upor ❤️ click korle sob ekhane save hoye jabe —
              pore ashte easy paben.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link
                href="/new-in"
                className="rounded-md bg-[#12509b] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Browse New In
              </Link>
              <Link
                href="/festival-26"
                className="rounded-md border border-[#12509b] px-6 py-2.5 text-sm font-semibold text-[#12509b] transition-colors hover:bg-[#12509b] hover:text-white"
              >
                Loomora Fest70
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
