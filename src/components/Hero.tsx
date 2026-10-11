"use client";
import type { HomeBanner, HomeCategory } from "@/lib/api/home";
import { mediaUrl } from "@/lib/api/media";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
type Slide = {
  src: string;
  title: string;
  href: string;
  kicker?: string;
  caption?: string;
  cta?: string;
};
type HeroTile = {
  src: string;
  label: string;
  caption: string;
  href: string;
};

function categoryLink(slug: string) {
  if (["men", "women", "kids"].includes(slug)) return `/${slug}`;
  return `/category/${slug}`;
}

function toSlides(banners: HomeBanner[]): Slide[] {
  return banners.map((b) => ({
    src: mediaUrl(b.image_url),
    kicker: b.badge_text ?? undefined,
    title: b.title,
    caption: b.subtitle,
    href: b.link_url,
    cta: b.button_text ?? undefined,
  }));
}

function toTiles(categories: HomeCategory[]): HeroTile[] {
  return categories.map((c) => ({
    src: mediaUrl(c.image),
    label: c.name.toUpperCase(),
    caption: c.description ?? "",
    href: categoryLink(c.slug),
  }));
}

export default function Hero({
  slides: apiSlides,
  banner: apiBanner,
  categories: apiCategories,
}: {
  slides?: HomeBanner[];
  banner?: HomeBanner;
  categories?: HomeCategory[];
}) {
  const slides = toSlides(apiSlides ?? []);
  const heroTiles = toTiles(apiCategories ?? []);

  const banner = apiBanner
    ? {
        src: mediaUrl(apiBanner.image_url),
        href: apiBanner.link_url,
        alt: `${apiBanner.title} — ${apiBanner.subtitle}`,
      }
    : null;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || slides.length === 0) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [paused, slides.length]);
  return (
    <>
      <section className="grid w-full gap-4 px-4 py-4 lg:grid-cols-[1.7fr_1fr]">
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-100 lg:aspect-[1664/945]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.src}
            aria-hidden={slideIndex !== index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              slideIndex === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.title}
              fill
              priority={slideIndex === 0}
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 pb-14 [text-shadow:0_1px_8px_rgba(0,0,0,0.55)] sm:p-8 sm:pb-16">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90">
                {slide.kicker}
              </p>
              <h1 className="mt-1 text-3xl font-extrabold leading-tight text-white sm:text-5xl">
                {slide.title}
              </h1>
              <p className="mt-2 hidden max-w-md text-sm text-white/90 sm:block sm:text-base">
                {slide.caption}
              </p>
              <Link
                href={slide.href}
                className="mt-4 inline-flex h-10 items-center rounded-full bg-[#12509b] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90 [text-shadow:none]"
              >
                {slide.cta ?? "Shop Now"}
              </Link>
            </div>
          </div>
        ))}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-2.5 py-1.5 backdrop-blur-sm">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setIndex(slideIndex)}
                aria-label={`Go to slide ${slideIndex + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  slideIndex === index ? "w-7 bg-white" : "w-2.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {heroTiles.map((tile) => (
          <Link
            key={tile.href}
            href={tile.href}
            className="group relative block h-36 overflow-hidden rounded-xl sm:h-44 lg:h-auto lg:flex-1"
          >
            <Image
              src={tile.src}
              alt={tile.label}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center p-5">
              <span className="text-2xl font-extrabold tracking-wide text-white sm:text-3xl">
                {tile.label}
              </span>
              <span className="mt-1 text-xs text-white/85 sm:text-sm">
                {tile.caption}
              </span>
            </div>
          </Link>
        ))}
      </div>
      </section>
      {banner && (
        <section className="w-full px-4 pb-6">
          <Link
            href={banner.href}
            aria-label={banner.alt}
            className="group relative block aspect-[2/1] overflow-hidden rounded-xl bg-[#f0e6d9]"
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              fill
              sizes="100vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </Link>
        </section>
      )}
    </>
  );
}
