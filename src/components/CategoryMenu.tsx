"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const collectionLinks = [
  { label: "Men's Collection", href: "/men" },
  { label: "Women's Collection", href: "/women" },
  { label: "Kid's Collection", href: "/kids" },
  { label: "Others Collection", href: "/new-in" },
];

const tiles = [
  {
    image: "/images/men/men.avif",
    label: "Men",
    href: "/men",
  },
  {
    image: "/images/women/women.avif",
    label: "Women",
    href: "/women",
  },
  {
    image: "/images/men/w-4.jpg",
    label: "Kids",
    href: "/kids",
  },
];

export default function CategoryMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const closeAll = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) closeAll();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeAll();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, closeAll]);

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex items-center gap-2 whitespace-nowrap text-[15px] font-bold text-[#12509b]"
      >
        <Menu className="h-4 w-4" />
        Shop By Category
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-[min(94vw,860px)] border border-zinc-200 bg-white p-5 shadow-2xl sm:p-6">
          <div className="flex flex-col gap-6 sm:flex-row">
            {/* Orange collection links */}
            <nav className="shrink-0 space-y-4 sm:w-52">
              {collectionLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeAll}
                  className="block font-serif text-lg text-[#e08245] transition-colors hover:text-[#c96a2e] hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Collection image tiles */}
            <div className="grid flex-1 grid-cols-3 gap-4">
              {tiles.map((tile) => (
                <Link
                  key={tile.href}
                  href={tile.href}
                  onClick={closeAll}
                  className="group relative block aspect-square overflow-hidden rounded-xl bg-zinc-100"
                >
                  <Image
                    src={tile.image}
                    alt={tile.label}
                    fill
                    sizes="(min-width: 640px) 22vw, 30vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute inset-x-0 bottom-0 p-2.5 text-center text-sm font-bold text-white sm:text-base">
                    {tile.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
