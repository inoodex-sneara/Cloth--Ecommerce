import CampaignPage, {
  type CollectionCard,
  type DealOffer,
} from "@/components/CampaignPage";
import { getHome } from "@/lib/api/home";
import { mediaUrl } from "@/lib/api/media";
import { getProducts } from "@/lib/api/products";

export const metadata = {
  title: "Budget Picks — Styles Under ৳1000 | Loomora",
  description:
    "Budget Picks at Loomora — quality tees, sweatshirts and kids styles all under ৳1000, without compromising comfort.",
};

function categoryLink(slug: string) {
  if (["men", "women", "kids"].includes(slug)) return `/${slug}`;
  return `/category/${slug}`;
}

export default async function BudgetPicksPage() {
  const [home, budget] = await Promise.all([
    getHome(),
    getProducts({ max_price: 1000, sort: "price_asc", per_page: 12 }),
  ]);

  const categories = home.categories.filter(
    (c) => !["winter-wear", "couple-dress"].includes(c.slug)
  );

  const cards: CollectionCard[] = categories.slice(0, 3).map((c) => ({
    image: mediaUrl(c.image),
    label: `${c.name} Under ৳1000`,
    sub: c.description ?? "Budget-friendly styles",
    href: categoryLink(c.slug),
  }));

  const products = budget?.products ?? [];

  const spotlights: CollectionCard[] = products.slice(0, 3).map((p) => ({
    image: p.src,
    label: p.name,
    sub: `৳ ${p.price.toLocaleString()}`,
    href: `/product/${p.id}`,
  }));

  const deals: DealOffer[] = products.map((p) => ({
    id: p.id,
    oldPrice: p.oldPrice ?? p.price,
    name: p.name,
    price: p.price,
    src: p.src,
  }));

  return (
    <CampaignPage
      eyebrow="Smart Shopping"
      title="Budget Picks"
      off="UNDER ৳1000"
      note="QUALITY THAT STAYS BUDGET"
      gradient="bg-[linear-gradient(135deg,#065f46_0%,#059669_55%,#34d399_100%)]"
      cards={cards}
      spotlights={spotlights}
      dealTitle="Cheapest Picks"
      dealHref="/best-deals"
      deals={deals}
    />
  );
}
