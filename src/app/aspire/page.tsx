import CampaignPage, {
  type CollectionCard,
  type DealOffer,
} from "@/components/CampaignPage";
import { getCampaignBySlug, getCampaigns } from "@/lib/api/campaigns";
import { getHome } from "@/lib/api/home";
import { mediaUrl } from "@/lib/api/media";
import { getProducts } from "@/lib/api/products";

export const metadata = {
  title: "ASPIRE — Premium Line | Loomora",
  description:
    "ASPIRE by Loomora — handpicked premium ethnic wear, blazers, knitwear and signature pieces for the discerning.",
};

function categoryLink(slug: string) {
  if (["men", "women", "kids"].includes(slug)) return `/${slug}`;
  return `/category/${slug}`;
}

export default async function AspirePage() {
  const [home, campaign, premiumProducts] = await Promise.all([
    getHome(),
    getCampaignBySlug("aspire").then(
      (c) => c ?? getCampaigns().then((list) => list[0] ?? null)
    ),
    getProducts({ sort: "price_desc", per_page: 12 }),
  ]);

  const categories = home.categories.filter(
    (c) => !["winter-wear", "couple-dress"].includes(c.slug)
  );

  const cards: CollectionCard[] = categories.slice(0, 3).map((c) => ({
    image: mediaUrl(c.image),
    label: c.name,
    sub: c.description ?? "Curated premium edit",
    href: categoryLink(c.slug),
  }));

  const items = campaign?.items ?? [];
  const spotlights: CollectionCard[] =
    items.length > 0
      ? items.slice(0, 3).map((it) => ({
          image: mediaUrl(it.product.primary_image),
          label: it.product.name,
          sub: `৳ ${it.flash_price.toLocaleString()}`,
          href: `/product/${it.product_id}`,
        }))
      : (premiumProducts?.products ?? []).slice(0, 3).map((p) => ({
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
      : (premiumProducts?.products ?? []).map((p) => ({
          id: p.id,
          oldPrice: p.oldPrice ?? p.price,
          name: p.name,
          price: p.price,
          src: p.src,
        }));

  return (
    <CampaignPage
      eyebrow="The Premium Line"
      title="ASPIRE"
      off="EXCLUSIVE EDIT"
      note="HANDPICKED LUXURY PIECES"
      gradient="bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_55%,#334155_100%)]"
      cards={cards}
      spotlights={spotlights}
      dealTitle="The Aspire Edit"
      dealHref="/new-in"
      deals={deals}
    />
  );
}
