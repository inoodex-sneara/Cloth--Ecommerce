import type { CatalogProduct } from "@/components/CatalogPageLayout";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({ product }: { product: CatalogProduct }) {
  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-200/90 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#12509b] hover:shadow-lg"
    >
      <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-zinc-100">
        <Image
          src={product.src}
          alt={product.name}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-0 top-0 rounded-br-lg bg-[#12509b] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs sm:px-2.5 sm:py-1 sm:text-[11px]">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-1 p-2.5 sm:p-3.5">
        <div>
          <div className="mb-1 flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-full border border-black/15 shadow-inner sm:h-3 sm:w-3"
              style={{ backgroundColor: product.color }}
            />
            <span className="truncate text-[10px] text-zinc-500 sm:text-xs">
              {product.category}
            </span>
          </div>

          <p className="line-clamp-2 text-xs font-medium leading-snug text-zinc-800 transition-colors group-hover:text-[#12509b] sm:text-sm">
            {product.name}
          </p>
        </div>

        <div className="mt-1 flex flex-wrap items-baseline gap-1.5 border-t border-zinc-100 pt-1.5 sm:gap-2">
          <span className="text-sm font-extrabold text-zinc-900 sm:text-base">
            ৳ {product.price.toLocaleString()}
          </span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-[11px] font-medium text-red-500 line-through sm:text-xs">
              ৳ {product.oldPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
