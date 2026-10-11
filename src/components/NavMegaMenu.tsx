import { categorySlug } from "@/lib/categories";
import Image from "next/image";
import Link from "next/link";

export type MegaSection = {
  heading?: string;
  items?: string[];
};

const categoryHref = (label: string) => `/category/${categorySlug(label)}`;

export default function NavMegaMenu({
  label,
  active,
  columns,
  image,
  imageHref,
}: {
  label: string;
  active: boolean;
  columns: MegaSection[][];
  image: string;
  imageHref: string;
}) {
  return (
    <div className="group relative hidden lg:block">
      <Link
        href={label === "Mens" ? "/men" : "/women"}
        className={`whitespace-nowrap text-sm transition-colors hover:text-[#12509b] xl:text-[15px] ${
          active
            ? "font-bold text-[#12509b] underline underline-offset-4"
            : "font-medium text-zinc-700"
        }`}
      >
        {label}
      </Link>

      <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:opacity-100">
        <div className="flex w-max max-w-[96vw] items-start gap-7 rounded-xl border border-zinc-200 bg-white p-6 shadow-2xl">
          {columns.map((sections, columnIndex) => (
            <div key={columnIndex} className="w-40 space-y-4">
              {sections.map((section) => (
                <div
                  key={section.heading ?? section.items?.join("|")}
                  className="space-y-1.5"
                >
                  {section.heading && (
                    <Link
                      href={categoryHref(section.heading)}
                      className="block text-sm font-bold text-[#e08245] transition-colors hover:text-[#c96a2e] hover:underline"
                    >
                      {section.heading}
                    </Link>
                  )}
                  {section.items?.map((item) => (
                    <Link
                      key={item}
                      href={categoryHref(item)}
                      className="block text-[13px] leading-snug text-zinc-600 transition-colors hover:text-[#12509b]"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ))}

          <Link
            href={imageHref}
            aria-label={`${label} collection`}
            className="relative hidden h-64 w-44 shrink-0 overflow-hidden rounded-lg bg-zinc-100 xl:block"
          >
            <Image
              src={image}
              alt={`${label} collection`}
              fill
              sizes="176px"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
