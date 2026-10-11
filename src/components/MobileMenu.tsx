"use client";

import type { NavLink } from "@/lib/navigation";
import { useSmoothScroll } from "@/providers/SmoothScrollProvider";
import { MapPin, Menu, ShoppingCart, SlidersHorizontal, Truck, User, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function MobileMenu({
  storeName,
  navLinks,
}: {
  storeName: string;
  navLinks: NavLink[];
}) {
  const [open, setOpen] = useState(false);
  const lenisRef = useSmoothScroll();

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lenis = lenisRef?.current;
    lenis?.stop();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      lenis?.start();
    };
  }, [open, close, lenisRef]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="ml-auto flex h-9 w-9 items-center justify-center text-[#12509b] lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[70]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={close}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 px-4">
              <span className="text-lg font-extrabold text-[#12509b]">{storeName}</span>
              <button
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="flex h-9 w-9 items-center justify-center text-zinc-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-2" data-lenis-prevent>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={close}
                  className="block px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-[#12509b]"
                >
                  {link.label}
                </Link>
              ))}

              <hr className="my-2 border-zinc-200" />

              <Link
                href="/order-tracking"
                onClick={close}
                className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-[#12509b]"
              >
                <Truck className="h-4 w-4" />
                Order Tracking
              </Link>
              <Link
                href="/outlets"
                onClick={close}
                className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-[#12509b]"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Outlets
              </Link>
              <Link
                href="/stores"
                onClick={close}
                className="flex items-center gap-2.5 px-4 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-[#12509b]"
              >
                <MapPin className="h-4 w-4" />
                Store Locations
              </Link>
            </nav>

            <div className="shrink-0 border-t border-zinc-200 p-4">
              <Link
                href="/account"
                onClick={close}
                className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#12509b] text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <User className="h-4 w-4" />
                Login / Register
              </Link>
              <Link
                href="/cart"
                onClick={close}
                className="mt-2 flex h-10 items-center justify-center gap-2 rounded-md border border-[#12509b] text-sm font-semibold text-[#12509b] transition-colors hover:bg-[#12509b] hover:text-white"
              >
                <ShoppingCart className="h-4 w-4" />
                View Cart
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
