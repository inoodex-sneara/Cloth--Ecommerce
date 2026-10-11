import { campaignItemToDeal, getCampaigns } from "@/lib/api/campaigns";
import { mediaUrl } from "@/lib/api/media";
import { ArrowRight, Eye, PackageSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Best Deals — Loomora",
  description:
    "Grab the best deals at Loomora — discounted shirts, ethnic wear, winter wear, kids fashion and more.",
};

type Deal = {
  id: string;
  name: string;
  price: number;
  oldPrice: number;
  color: string;
  src: string;
};

type DealSection = {
  title: string;
  href: string;
  banner: {
    label: string;
    off: string;
    note: string;
    img?: string;
    gradient?: string;
  };
  deals: Deal[];
};

const gradients = [
  "bg-[linear-gradient(140deg,#0c4a6e_0%,#12509b_55%,#38bdf8_100%)]",
  "bg-[linear-gradient(140deg,#7f1d1d_0%,#9f1239_55%,#e11d48_100%)]",
  "bg-[linear-gradient(140deg,#14532d_0%,#166534_55%,#4ade80_100%)]",
  "bg-[linear-gradient(140deg,#4c1d95_0%,#6d28d9_55%,#c084fc_100%)]",
];

async function apiSections(): Promise<DealSection[]> {
  const campaigns = await getCampaigns();
  return campaigns
    .filter((campaign) => (campaign.items?.length ?? 0) > 0)
    .map((campaign, index) => ({
      title: campaign.title,
      href: `/search?q=${encodeURIComponent(campaign.title)}`,
      banner: {
        label: campaign.slug.replace(/-/g, " "),
        off: "SPECIAL DEAL",
        note: campaign.ends_at
          ? `ENDS ${new Date(campaign.ends_at).toLocaleDateString("en-GB")}`
          : "LIMITED TIME",
        gradient: gradients[index % gradients.length],
      },
      deals: campaign.items.map((item) => {
        const deal = campaignItemToDeal(item);
        return {
          id: deal.id,
          name: deal.name,
          price: deal.price,
          oldPrice: deal.oldPrice,
          color: "#71717a",
          src: mediaUrl(deal.src),
        };
      }),
    }));
}

function DealCard({ deal }: { deal: Deal }) {
  const save = deal.oldPrice - deal.price;

  return (
    <Link
      href={`/product/${deal.id}`}
      className="group relative flex min-h-52 overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:border-[#12509b] hover:shadow-md"
    >
      <span className="absolute left-0 top-0 z-10 rounded-br-lg bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white">
        Save ৳ {save}
      </span>

      <div className="relative w-2/5 shrink-0 bg-zinc-100">
        <Image
          src={deal.src}
          alt={deal.name}
          fill
          sizes="(min-width: 1280px) 15vw, (min-width: 640px) 30vw, 45vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 flex translate-y-1 items-center justify-center bg-slate-400/70 py-1.5 opacity-0 backdrop-blur-xs transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#12509b] text-white">
            <Eye className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-2.5 p-4">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-extrabold text-zinc-900">
            ৳ {deal.price.toLocaleString()}
          </span>
          <span className="text-sm font-medium text-red-500 line-through">
            ৳ {deal.oldPrice.toLocaleString()}
          </span>
        </div>

        <span
          aria-hidden
          className="h-3.5 w-3.5 rounded-sm border border-black/15 shadow-inner"
          style={{ backgroundColor: deal.color }}
        />

        <p className="line-clamp-2 text-sm font-medium leading-snug text-zinc-700 transition-colors group-hover:text-[#12509b]">
          {deal.name}
        </p>
      </div>
    </Link>
  );
}

export default async function BestDealsPage() {
  const allSections = await apiSections();

  return (
    <div className="w-full bg-white">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 px-4 py-4 text-sm text-zinc-500">
        <Link href="/" className="transition-colors hover:text-[#12509b]">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-zinc-800">Best Deals</span>
      </nav>

      <div className="space-y-6 px-4 pb-10">
        {allSections.length === 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-[#f7f8fc] p-10 text-center">
            <PackageSearch className="mx-auto h-10 w-10 text-zinc-400" />
            <h2 className="mt-4 text-lg font-bold text-zinc-900">
              Akhon kono active deal nei
            </h2>
            <p className="mt-1.5 text-sm text-zinc-500">
              Notun deal shuru hole ekhane chole ashbe.
            </p>
          </div>
        )}
        {allSections.map((section) => (
          <section
            key={section.title}
            className="rounded-3xl bg-[#f5f6f8] p-5 sm:p-7"
          >
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_34rem]">
              <div className="flex min-w-0 flex-col gap-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 sm:text-3xl">
                    {section.title}
                  </h2>
                  <Link
                    href={section.href}
                    className="flex items-center gap-2 text-base font-bold text-[#12509b] transition-opacity hover:opacity-80"
                  >
                    See More
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.deals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </div>
              </div>

              <Link
                href={section.href}
                className="relative block min-h-64 overflow-hidden rounded-2xl xl:min-h-full"
              >
                {section.banner.img ? (
                  <>
                    <Image
                      src={section.banner.img}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 34rem, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50" />
                  </>
                ) : (
                  <div
                    className={`absolute inset-0 ${section.banner.gradient ?? ""}`}
                  />
                )}
                <div className="relative flex h-full flex-col items-center justify-center gap-4 p-8 text-center text-white">
                  <span className="text-xs font-bold uppercase tracking-[0.3em]">
                    {section.banner.label}
                  </span>
                  <span className="text-4xl font-black tracking-tight sm:text-5xl">
                    {section.banner.off}
                  </span>
                  <span className="rounded-full border border-white/60 px-4 py-1 text-sm font-semibold">
                    {section.banner.note}
                  </span>
                </div>
              </Link>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
