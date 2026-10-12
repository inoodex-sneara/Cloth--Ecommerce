import CampaignPage, {
  type CollectionCard,
  type DealOffer,
} from "@/components/CampaignPage";
import { getCampaignBySlug } from "@/lib/api/campaigns";
import { getHome } from "@/lib/api/home";
import { mediaUrl } from "@/lib/api/media";
import { getProducts } from "@/lib/api/products";

export const metadata = {
  title: "Loomora Fest70 — Upto 70% Off | Loomora",
  description:
    "Celebrate Loomora Fest70 with upto 70% off on ethnic wear, festive kurti, saree, panjabi and kids festive collection.",
};

function categoryLink(slug: string) {
  if (["men", "women", "kids"].includes(slug)) return `/${slug}`;
  return `/category/${slug}`;
}

export default async function Festival26Page() {
  const [home, campaign, bestSellers] = await Promise.all([
    getHome(),
    getCampaignBySlug("festival-26"),
    getProducts({ sort: "rating", per_page: 12 }),
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

  // Prefer campaign items if a festival-26 campaign exists; else top-rated products.
  const items = campaign?.items ?? [];
  const spotlights: CollectionCard[] =
    items.length > 0
      ? items.slice(0, 3).map((it) => ({
          image: mediaUrl(it.product.primary_image),
          label: it.product.name,
          sub: `৳ ${it.flash_price.toLocaleString()}`,
          href: `/product/${it.product_id}`,
        }))
      : (bestSellers?.products ?? []).slice(0, 3).map((p) => ({
          image: p.src,
          label: p.name,
          sub: `৳ ${p.price.toLocaleString()}`,
          href: `/product/${p.id}`,
        }));

  const deals: DealOffer[] =
    items.length > 0
      ? items.map((it) => ({
          id: String(it.product_id),
          oldPrice: it.product.compare_price ?? it.product.price,
          name: it.product.name,
          price: it.flash_price,
          src: mediaUrl(it.product.primary_image),
        }))
      : (bestSellers?.products ?? []).map((p) => ({
          id: p.id,
          oldPrice: p.oldPrice ?? p.price,
          name: p.name,
          price: p.price,
          src: p.src,
        }));

  return (
    <CampaignPage
      eyebrow="Sale is live — limited time"
      title="Loomora Fest70"
      off="UPTO 70% OFF"
      note="FREE DELIVERY ON ৳148+"
      gradient="bg-[linear-gradient(135deg,#7f1d1d_0%,#9f1239_55%,#e11d48_100%)]"
      cards={cards}
      spotlights={spotlights}
      dealTitle="Fest70 Hot Picks"
      dealHref="/best-deals"
      deals={deals}
    />
  );
}
