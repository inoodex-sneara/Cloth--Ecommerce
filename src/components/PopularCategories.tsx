"use client";

import type { HomeCategory } from "@/lib/api/home";
import { mediaUrl } from "@/lib/api/media";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function animateScroll(scroller: HTMLDivElement, target: number, duration = 700) {
  const start = scroller.scrollLeft;
  const delta = target - start;
  if (delta === 0) return;
  const startTime = performance.now();

  const step = (now: number) => {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    scroller.scrollLeft = start + delta * eased;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

export default function PopularCategories({
  categories: apiCategories,
}: {
  categories?: HomeCategory[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef<1 | -1>(1);
  const [revealed, setRevealed] = useState(false);

  const items = (apiCategories ?? []).map((c) => ({
    label: c.name,
    src: mediaUrl(c.image),
    href: `/category/${c.slug}`,
  }));

  const getStep = (scroller: HTMLDivElement) => {
    const card = scroller.querySelector<HTMLElement>("a");
    return (card ? card.offsetWidth : 200) + 20;
  };

  const scrollOne = (direction: 1 | -1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const target = Math.min(
      max,
      Math.max(0, scroller.scrollLeft + direction * getStep(scroller))
    );
    animateScroll(scroller, target);
    directionRef.current = direction;
  };

  const autoStep = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    if (max <= 0) return;

    if (scroller.scrollLeft >= max - 1) directionRef.current = -1;
    else if (scroller.scrollLeft <= 1) directionRef.current = 1;

    const target = Math.min(
      max,
      Math.max(
        0,
        scroller.scrollLeft + directionRef.current * getStep(scroller)
      )
    );
    animateScroll(scroller, target);
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(scroller);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const id = setInterval(autoStep, 1600);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="w-full px-4 py-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
          Popular Categories
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => scrollOne(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 transition-colors hover:border-[#12509b] hover:text-[#12509b]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => scrollOne(1)}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 transition-colors hover:border-[#12509b] hover:text-[#12509b]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-5 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((category, index) => (
          <Link
            key={category.label}
            href={category.href}
            style={{ transitionDelay: `${index * 90}ms` }}
            className={`group/item flex w-36 shrink-0 flex-col items-center gap-3 transition-[transform,opacity] duration-500 ease-out sm:w-40 xl:w-48 2xl:w-60 ${
              revealed
                ? "pointer-events-auto translate-x-0 opacity-100"
                : `pointer-events-none opacity-0 ${
                    index % 2 === 0 ? "-translate-x-12" : "translate-x-12"
                  }`
            }`}
          >
            <span className="relative block h-36 w-36 overflow-hidden rounded-full border border-zinc-100 bg-zinc-50 sm:h-40 sm:w-40 xl:h-48 xl:w-48 2xl:h-60 2xl:w-60">
              <Image
                src={category.src}
                alt={category.label}
                fill
                sizes="(min-width: 1536px) 240px, (min-width: 1280px) 192px, 160px"
                className="object-cover transition-transform duration-500 group-hover/item:scale-105"
              />
            </span>
            <span className="text-center text-sm font-medium leading-snug text-zinc-800 sm:text-base">
              {category.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
