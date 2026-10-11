"use client";

import type { HomeBanner } from "@/lib/api/home";
import { mediaUrl } from "@/lib/api/media";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function ExclusiveCollection({
  video: apiVideo,
  categoryBanner: apiCategoryBanner,
}: {
  video?: HomeBanner;
  categoryBanner?: HomeBanner;
}) {
  const videoSrc = apiVideo ? mediaUrl(apiVideo.image_url) : null;
  const videoHref = apiVideo?.link_url ?? "/new-in";
  const sideBanner = apiCategoryBanner
    ? {
        src: mediaUrl(apiCategoryBanner.image_url),
        href: apiCategoryBanner.link_url,
        alt: `${apiCategoryBanner.title} — ${apiCategoryBanner.subtitle}`,
      }
    : null;

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full px-4 pb-6">
      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        {videoSrc && (
          <Link
            href={videoHref}
            className="group relative block overflow-hidden rounded-xl bg-zinc-900"
          >
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="text-center text-3xl font-extrabold uppercase tracking-wide text-white [text-shadow:0_2px_0_#12509b,0_4px_18px_rgba(0,0,0,0.45)] sm:text-5xl">
                Exclusive Collection
              </span>
            </div>
          </Link>
        )}

        {sideBanner && (
          <Link
            href={sideBanner.href}
            className="group relative block min-h-[220px] overflow-hidden rounded-xl bg-zinc-100 lg:min-h-0"
          >
            <Image
              src={sideBanner.src}
              alt={sideBanner.alt}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
        )}
      </div>
    </section>
  );
}
