"use client";

import type { StoreSettings } from "@/lib/api/settings";
import { Mail, MapPin, Phone, Apple, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const stop = (e: React.MouseEvent) => e.preventDefault();

const companyLinks = [
  { label: "Blogs", href: "/blogs" },
  { label: "Media", href: "/#" },
  { label: "Careers", href: "/#" },
  { label: "About Us", href: "/pages/about-us" },
  { label: "Contact Us", href: "/contact" },
];

const customerLinks = [
  { label: "Login", href: "/#" },
  { label: "Register", href: "/#" },
  { label: "Brands", href: "/#" },
  { label: "Best Deals", href: "/#" },
  { label: "Marketplace", href: "/#" },
];

const helpLinks = [
  { label: "FAQs", href: "/#" },
  { label: "Privacy Policy", href: "/pages/privacy-policy" },
  { label: "Cookies Policy", href: "/#" },
  { label: "Terms & Conditions", href: "/pages/terms-and-conditions" },
  { label: "Replacement Policy", href: "/pages/shipping-and-returns" },
  { label: "EMI Terms & Conditions", href: "/#" },
];

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-4 w-4">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
      className="h-4 w-4"
    >
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-4 w-4">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 7a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7zm10 1.6L17.2 12 12 15.4V8.6z"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-4 w-4">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.29 19.491h2.039L6.486 3.24H4.298l13.313 17.404z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-4 w-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function buildSocials(settings: StoreSettings) {
  const all = [
    { label: "Facebook", Icon: FacebookIcon, url: settings.social_facebook },
    { label: "Instagram", Icon: InstagramIcon, url: settings.social_instagram },
    { label: "YouTube", Icon: YoutubeIcon, url: settings.social_youtube },
    { label: "X", Icon: XIcon, url: settings.social_twitter },
    { label: "LinkedIn", Icon: LinkedinIcon, url: null as string | null },
  ];
  return all.filter((s) => s.url);
}

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-3 text-base font-bold text-zinc-900">{title}</h3>
      <ul className="space-y-1.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              onClick={stop}
              className="text-sm text-zinc-600 transition-colors hover:text-[#12509b]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer({ settings }: { settings: StoreSettings }) {
  const socials = buildSocials(settings);

  return (
    <footer className="mt-auto w-full border-t border-zinc-200 bg-white">
      <div className="grid w-full gap-8 px-4 py-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <div>
          <h3 className="mb-3 text-base font-bold text-zinc-900">Contact Us</h3>
          <ul className="space-y-2.5 text-sm text-zinc-600">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#12509b]" />
              <span>{settings.contact_address}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#12509b]" />
              <a
                href={`tel:${settings.contact_phone.replace(/[^+\d]/g, "")}`}
                className="hover:text-[#12509b]"
              >
                {settings.contact_phone}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#12509b]" />
              <a
                href={`mailto:${settings.contact_email}`}
                className="hover:text-[#12509b]"
              >
                {settings.contact_email}
              </a>
            </li>
          </ul>
        </div>

        <LinkColumn title="Company" links={companyLinks} />
        <LinkColumn title="Customer" links={customerLinks} />
        <LinkColumn title="Help" links={helpLinks} />

        <div>
          {socials.length > 0 && (
            <>
              <h3 className="mb-3 text-base font-bold text-zinc-900">
                Social Media for {settings.store_name}
              </h3>
              <div className="flex items-center gap-3">
                {socials.map(({ label, Icon, url }) => (
                  <Link
                    key={label}
                    href={url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[#12509b] text-white transition-opacity hover:opacity-85"
                  >
                    <Icon />
                  </Link>
                ))}
              </div>
            </>
          )}

            <h3 className="mb-3 mt-6 text-base font-bold text-zinc-900">
              Download App
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#"
                onClick={stop}
                className="flex h-11 items-center gap-2.5 rounded-lg bg-zinc-900 px-3.5 text-white transition-opacity hover:opacity-85"
              >
                <Play className="h-5 w-5 fill-current" />
                <span className="flex flex-col leading-tight">
                  <span className="text-[9px] uppercase">Get it on</span>
                  <span className="text-sm font-semibold">Google Play</span>
                </span>
              </Link>
              <Link
                href="/#"
                onClick={stop}
                className="flex h-11 items-center gap-2.5 rounded-lg bg-zinc-900 px-3.5 text-white transition-opacity hover:opacity-85"
              >
                <Apple className="h-5 w-5" />
                <span className="flex flex-col leading-tight">
                  <span className="text-[9px] uppercase">Download on the</span>
                  <span className="text-sm font-semibold">App Store</span>
                </span>
              </Link>
            </div>

            <h3 className="mb-3 mt-6 text-base font-bold text-zinc-900">
              Payment Methods
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-8 items-center justify-center rounded border border-zinc-200 bg-white px-2.5 shadow-2xs">
                <Image
                  src="/hero/bkash.png"
                  alt="bKash"
                  width={56}
                  height={22}
                  className="h-5 w-auto object-contain"
                />
              </div>
              <div className="flex h-8 items-center justify-center rounded border border-zinc-200 bg-white px-2 shadow-2xs">
                <Image
                  src="/hero/nagad.jpg"
                  alt="Nagad"
                  width={56}
                  height={22}
                  className="h-5 w-auto object-contain rounded-xs"
                />
              </div>
              <div className="flex h-8 items-center justify-center rounded border border-zinc-200 bg-white px-2.5 text-xs font-bold text-[#1a1f71] shadow-2xs">
                VISA
              </div>
              <div className="flex h-8 items-center justify-center rounded border border-zinc-200 bg-white px-2.5 text-xs font-bold text-[#eb001b] shadow-2xs">
                Mastercard
              </div>
              <div className="flex h-8 items-center justify-center rounded border border-zinc-200 bg-white px-2.5 text-xs font-bold text-emerald-700 shadow-2xs">
                COD
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-200">
          <p className="px-4 py-5 text-center text-sm text-zinc-600">
            © 2026 {settings.store_name} {settings.store_tagline}. All Rights Reserved.
          </p>
        </div>
      </footer>
    );
  }
