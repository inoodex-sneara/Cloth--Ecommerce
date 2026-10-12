import CampaignPage, {
  type CollectionCard,
  type DealOffer,
} from "@/components/CampaignPage";
import { getCampaignBySlug, getCampaigns } from "@/lib/api/campaigns";
import { getHome } from "@/lib/api/home";
import { mediaUrl } from "@/lib/api/media";

export const metadata = {
  title: "PUJA-2026 — Festive Collection | Loomora",
  description:
    "Shop the PUJA-2026 festive collection at Loomora — ethnic wear, party formals and kids styles with special discounts.",
};

function categoryLink(slug: string) {
  if (["men", "women", "kids"].includes(slug)) return `/${slug}`;
  return `/category/${slug}`;
}

export default async function Puja2026Page() {
  const [home, campaign] = await Promise.all([
    getHome(),
    getCampaignBySlug("puja-2026").then(
      (c) => c ?? getCampaigns().then((list) => list[0] ?? null)
    ),
  ]);

  const categories = home.categories.filter(
    (c) => !["winter-wear", "couple-dress"].includes(c.slug)
  );

  const cards: CollectionCard[] = categories.slice(0, 3).map((c) => ({
    image: mediaUrl(c.image),
    label: c.name,
    sub: c.description ?? "Shop the festive edit",
    href: categoryLink(c.slug),
  }));

  const items = campaign?.items ?? [];
  const spotlights: CollectionCard[] = items.slice(0, 3).map((it) => ({
    image: mediaUrl(it.product.primary_image),
    label: it.product.name,
    sub: `৳ ${it.flash_price.toLocaleString()}`,
    href: `/product/${it.product_id}`,
  }));

  const deals: DealOffer[] = items.map((it) => ({
    id: String(it.product_id),
    oldPrice: it.product.compare_price ?? it.product.price,
    name: it.product.name,
    price: it.flash_price,
    src: mediaUrl(it.product.primary_image),
  }));

  return (
    <CampaignPage
      eyebrow="Durga Puja Special"
      title="PUJA-2026"
      off="UP TO 60% OFF"
      note="FESTIVE COLLECTION 2026"
      gradient="bg-[linear-gradient(135deg,#9a3412_0%,#c2410c_50%,#f59e0b_100%)]"
      cards={cards}
      spotlights={spotlights}
      dealTitle="Puja Special Deals"
      dealHref="/best-deals"
      deals={deals}
    />
  );
}
