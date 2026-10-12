"use client";

import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getProduct } from "@/lib/catalog";

export type CollectionCard = {
  image: string;
  label: string;
  sub: string;
  href: string;
};

export type DealOffer = {
  id: string;
  oldPrice: number;
  /** API-driven data — when present, catalog lookup is skipped. */
  name?: string;
  price?: number;
  src?: string;
};

const sidebarLinks = [
  { label: "Mens Collection", href: "/men" },
  { label: "Womens Collection", href: "/women" },
  { label: "Kids Collection", href: "/kids" },
  { label: "Others Collection", href: "/new-in" },
];

function SectionHeading({
  accent,
  title,
  subtitle,
}: {
  accent: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <span className={`h-6 w-1.5 rounded-full ${accent}`} />
        <h2 className="text-2xl font-black tracking-tight text-zinc-900 sm:text-3xl">
          {title}
        </h2>
      </div>
      {subtitle ? (
        <p className="mt-2 pl-[calc(0.375rem+0.75rem)] text-sm text-zinc-500">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function CategoryTile({ card }: { card: CollectionCard }) {
  return (
    <Link
      href={card.href}
      className="group relative block overflow-hidden rounded-[2rem] bg-zinc-100 shadow-md ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
    >
      <div className="relative aspect-[3/4] w-full">
        <Image
          src={card.image}
          alt={card.label}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
        />
        {/* Soft bottom vignette for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300" />
      </div>

      {/* Floating interactive bottom button card */}
      <div className="absolute inset-x-3.5 bottom-3.5 rounded-2xl border border-white/70 bg-white/85 p-3.5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 group-hover:border-white group-hover:bg-white/95 group-hover:shadow-[0_18px_35px_-8px_rgba(0,0,0,0.25)] sm:inset-x-4 sm:bottom-4 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-black tracking-tight text-zinc-900 transition-colors duration-200 group-hover:text-black sm:text-lg">
              {card.label}
            </p>
            <p className="mt-0.5 truncate text-[11px] font-medium text-zinc-500 transition-colors duration-200 group-hover:text-zinc-700 sm:text-xs">
              {card.sub}
            </p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white shadow-md ring-2 ring-black/5 transition-all duration-300 group-hover:scale-105 group-hover:bg-black group-hover:shadow-lg sm:h-10 sm:w-10">
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function SpotlightCard({ card }: { card: CollectionCard }) {
  return (
    <Link
      href={card.href}
      className="group block overflow-hidden rounded-[1.75rem] border border-zinc-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100">
        <Image
          src={card.image}
          alt={card.label}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 92vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-[#12509b]/90 py-3 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
          View Details
        </div>
      </div>
      <div className="p-5">
        <p className="line-clamp-2 text-sm font-bold leading-snug text-zinc-900 transition-colors group-hover:text-[#12509b] sm:text-base">
          {card.label}
        </p>
        <p className="mt-1.5 text-lg font-black text-[#12509b]">{card.sub}</p>
      </div>
    </Link>
  );
}

function DealCard({ id, oldPrice, name, price, src }: DealOffer) {
  const fallback = src ? null : getProduct(id);
  if (!src && !fallback) return null;

  const resolvedName = name ?? fallback?.name ?? "";
  const resolvedPrice = price ?? fallback?.price ?? 0;
  const resolvedSrc = src ?? fallback?.src ?? "";

  const save = oldPrice - resolvedPrice;
  const hasDiscount = save > 0;
  const savePct =
    hasDiscount && oldPrice > 0 ? Math.round((save / oldPrice) * 100) : 0;

  return (
    <Link
      href={`/product/${id}`}
      className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-zinc-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100">
        <Image
          src={resolvedSrc}
          alt={resolvedName}
          fill
          sizes="(min-width: 1280px) 22vw, (min-width: 640px) 30vw, 46vw"
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute left-3.5 top-3.5 z-10 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-3.5 py-1.5 text-[11px] font-black text-white shadow-lg">
            −{savePct}%
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-[#12509b]/90 py-3 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
          View Product
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <p className="line-clamp-2 text-sm font-bold leading-snug text-zinc-900 transition-colors group-hover:text-[#12509b] sm:text-[15px]">
          {resolvedName}
        </p>
        <div className="mt-auto flex flex-wrap items-baseline gap-2 pt-1.5">
          <span className="text-xl font-black text-[#12509b]">
            ৳ {resolvedPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm font-medium text-zinc-400 line-through">
              ৳ {oldPrice.toLocaleString()}
            </span>
          )}
          {hasDiscount && (
            <span className="ml-auto rounded-lg bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600">
              Save ৳{save.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

type CampaignPageProps = {
  eyebrow?: string;
  title: string;
  off?: string;
  note?: string;
  gradient?: string;
  cards: CollectionCard[];
  spotlights: CollectionCard[];
  dealTitle: string;
  dealHref: string;
  deals: DealOffer[];
};

export default function CampaignPage({
  eyebrow,
  title,
  off,
  note,
  gradient,
  cards,
  spotlights,
  dealTitle,
  dealHref,
  deals,
}: CampaignPageProps) {
  const [open, setOpen] = useState(false);
  const heroGradient =
    gradient ?? "bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_50%,#12509b_100%)]";

  return (
    <div className="w-full bg-[#fafaf9]">
      {/* Hero banner */}
      <div className={`${heroGradient} relative overflow-hidden`}>
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative mx-auto max-w-[1440px] px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          {eyebrow ? (
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/75">
              <Sparkles className="h-3 w-3" />
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-0.5 max-w-3xl text-2xl font-black tracking-tight text-white drop-shadow-sm sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-2.5">
            {off ? (
              <span className="rounded-full bg-white px-3.5 py-1 text-xs font-black tracking-wide text-zinc-900 shadow-md sm:text-sm">
                {off}
              </span>
            ) : null}
            {note ? (
              <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-sm sm:text-xs">
                {note}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-12">
          <aside className="hidden w-52 shrink-0 lg:block">
            <nav className="sticky top-32 py-2">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-center gap-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:text-zinc-600"
                aria-expanded={open}
              >
                Collections
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                />
              </button>
              <ul
                className={`overflow-hidden transition-all duration-300 ${open ? "mt-5 max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
              >
                {sidebarLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="block py-2.5 text-center text-[13px] font-bold uppercase tracking-[0.14em] text-[#c17a5a] transition-colors hover:text-[#a85f3f]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          <div className="min-w-0 flex-1 space-y-14">
            {cards.length > 0 ? (
              <div>
                <SectionHeading
                  accent="bg-[#e08245]"
                  title="Shop by Category"
                  subtitle="Curated festive collections for everyone"
                />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {cards.map((card) => (
                    <CategoryTile key={card.label} card={card} />
                  ))}
                </div>
              </div>
            ) : null}

            {spotlights.length > 0 ? (
              <div>
                <SectionHeading
                  accent="bg-[#12509b]"
                  title="Festive Spotlight"
                  subtitle="Handpicked pieces stealing the spotlight this season"
                />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {spotlights.map((card) => (
                    <SpotlightCard key={card.label} card={card} />
                  ))}
                </div>
              </div>
            ) : null}

            {deals.length > 0 ? (
              <section className="rounded-[2rem] border border-zinc-200/80 bg-white p-5 shadow-sm sm:p-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <SectionHeading
                    accent="bg-red-500"
                    title={dealTitle}
                    subtitle="Limited-time prices — grab them before they're gone"
                  />
                  <Link
                    href={dealHref}
                    className="mb-6 flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-bold text-[#12509b] transition-all hover:border-[#12509b] hover:shadow-md sm:text-base"
                  >
                    See More
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                  {deals.map((deal) => (
                    <DealCard key={deal.id} {...deal} />
                  ))}
                </div>
              </section>
            ) : null}

            {cards.length === 0 && spotlights.length === 0 && deals.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-zinc-300 py-16 text-center text-sm text-zinc-500">
                No products available right now. Check back soon!
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
