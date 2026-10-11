import DailyDeals from "@/components/DailyDeals";
import ExclusiveCollection from "@/components/ExclusiveCollection";
import Hero from "@/components/Hero";
import NewCollection from "@/components/NewCollection";
import PopularCategories from "@/components/PopularCategories";
// import UnlimitedOffer from "@/components/UnlimitedOffer";
import { getHome } from "@/lib/api/home";

export default async function Home() {
  const home = await getHome();

  const heroSlides = home.banners.filter((b) => b.placement === "hero_slider");
  const homeBanner = home.banners.find((b) => b.placement === "home_banner");
  const categoryBanner = home.banners.find(
    (b) => b.placement === "category_banner"
  );
  const homeVideo = home.banners.find((b) => b.placement === "home_video");
  const campaign = home.active_campaigns[0];

  return (
    <div className="flex flex-1 flex-col bg-white font-sans">
      <Hero
        slides={heroSlides}
        banner={homeBanner}
        categories={home.categories}
      />
      {/* <UnlimitedOffer /> */}
      <ExclusiveCollection video={homeVideo} categoryBanner={categoryBanner} />
      <PopularCategories categories={home.categories} />
      <DailyDeals campaign={campaign} />
      <NewCollection products={home.new_arrivals} />
    </div>
  );
}
