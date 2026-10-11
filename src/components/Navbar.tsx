"use client";

import CategoryMenu from "@/components/CategoryMenu";
import MensMenu from "@/components/MensMenu";
import MobileMenu from "@/components/MobileMenu";
import { catalog } from "@/lib/catalog";
import WomensMenu from "@/components/WomensMenu";
import { buildNavLinks } from "@/lib/navigation";
import type { StoreSettings } from "@/lib/api/settings";
import { useCart } from "@/providers/CartProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import {
  Heart,
  Search,
  ShoppingCart,
  Truck,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function SearchForm({
  className = "",
  inputId,
}: {
  className?: string;
  inputId?: string;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Instant live search matches
  const trimmed = query.trim().toLowerCase();
  const words = trimmed.split(/\s+/).filter(Boolean);
  
  const matches = trimmed
    ? catalog
        .filter((item) => {
          const searchableText = [
            item.name,
            item.category,
            item.brand,
            item.colorName,
            item.productType,
            item.fabric,
            item.fit,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return words.every((word) => searchableText.includes(word));
        })
        .slice(0, 6)
    : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="flex w-full items-center">
        <div className="relative flex-1">
          <input
            type="text"
            name="q"
            id={inputId}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="I'm shopping for ..."
            className="h-9 w-full rounded-l-md border-2 border-[#12509b] px-3 pr-8 text-base text-zinc-800 outline-none placeholder:text-zinc-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              aria-label="Clear search query"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          aria-label="Search"
          className="flex h-9 w-10 shrink-0 items-center justify-center rounded-r-md bg-[#12509b] text-white transition-opacity hover:opacity-90 cursor-pointer"
        >
          <Search className="h-4 w-4" />
        </button>
      </form>

      {/* Live search suggestions dropdown */}
      {isOpen && trimmed.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-lg border border-zinc-200 bg-white p-2 shadow-xl">
          {matches.length > 0 ? (
            <div className="flex flex-col gap-1">
              <span className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Products ({matches.length})
              </span>
              {matches.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-zinc-50"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-zinc-100">
                    <Image
                      src={product.src}
                      alt={product.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate text-sm font-semibold text-zinc-900">
                      {product.name}
                    </span>
                    <span className="text-xs text-zinc-500">{product.category}</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#12509b]">
                    ৳ {product.price}
                  </span>
                </Link>
              ))}
              <button
                type="button"
                onClick={() => handleSearch(query)}
                className="mt-1 flex w-full items-center justify-center rounded-md bg-[#12509b]/10 py-2 text-xs font-bold text-[#12509b] transition-colors hover:bg-[#12509b] hover:text-white"
              >
                View all results for &quot;{query}&quot;
              </button>
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-sm font-medium text-zinc-700">
                No products found for &quot;{query}&quot;
              </p>
              <button
                type="button"
                onClick={() => handleSearch(query)}
                className="mt-2 text-xs font-semibold text-[#12509b] underline"
              >
                Search all catalog anyway
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function IconBadge({ count }: { count: number }) {
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#12509b] px-1 text-[10px] font-bold text-white">
      {count}
    </span>
  );
}

export default function Navbar({ settings }: { settings: StoreSettings }) {
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const pathname = usePathname();
  const navLinks = buildNavLinks(settings.navigation_menu);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs">
      <div className="flex h-14 w-full items-center gap-3 px-4 sm:h-16 md:gap-8">
        <Link
          href="/"
          className="ml-2 flex shrink-0 flex-col leading-none sm:ml-5"
        >
          <span className="text-2xl font-extrabold tracking-tight text-[#12509b] sm:text-[2rem]">
            {settings.store_name}
          </span>
          <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
            {settings.store_tagline}
          </span>
        </Link>

        <SearchForm className="mx-auto hidden md:flex md:max-w-[28rem] md:flex-1" />

        <div className="ml-auto flex items-center gap-3.5 sm:gap-4 md:gap-5">
          <button
            type="button"
            aria-label="Search"
            onClick={() => {
              const input = document.getElementById("mobile-search");
              input?.scrollIntoView({ block: "center", behavior: "smooth" });
              input?.focus();
            }}
            className="text-[#12509b] md:hidden cursor-pointer"
          >
            <Search className="h-5 w-5" />
          </button>

          <Link href="/wishlist" aria-label="Wishlist" className="relative text-[#12509b]">
            <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
            <IconBadge count={wishlistCount} />
          </Link>

          <Link href="/cart" aria-label="Cart" className="relative text-[#12509b]">
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
            <IconBadge count={count} />
          </Link>

          <Link
            href="/account"
            aria-label="Login or register"
            className="flex items-center gap-2 text-[#12509b] transition-opacity hover:opacity-80"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-300 sm:h-9 sm:w-9">
              <User className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span className="hidden flex-col text-xs font-semibold leading-tight sm:flex">
         
            </span>
          </Link>
        </div>
      </div>

      <div className="px-4 pb-3 md:hidden">
        <SearchForm inputId="mobile-search" />
      </div>

      <div className="border-y border-zinc-200">
        <div className="flex h-11 w-full items-center gap-4 px-4 sm:gap-6">
          <CategoryMenu />

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-3.5 lg:flex xl:gap-6">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              if (link.href === "/women") {
                return <WomensMenu key={link.href} active={active} />;
              }
              if (link.href === "/men") {
                return <MensMenu key={link.href} active={active} />;
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`whitespace-nowrap text-sm transition-colors hover:text-[#12509b] xl:text-[15px] ${
                    active
                      ? "font-bold text-[#12509b] underline underline-offset-4"
                      : link.highlight
                        ? "font-medium text-[#12509b] underline underline-offset-4"
                        : "font-medium text-zinc-700"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto hidden shrink-0 items-center gap-5 text-sm font-semibold text-[#12509b] sm:text-[15px] lg:flex">
            <Link href="/order-tracking" className="flex items-center gap-1.5">
              <Truck className="h-4 w-4" />
              Order Tracking
            </Link>
          </div>

          <MobileMenu storeName={settings.store_name} navLinks={navLinks} />
        </div>
      </div>
    </header>
  );
}
