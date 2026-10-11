"use client";

import type { CatalogProduct } from "@/components/CatalogPageLayout";
import {
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Heart,
  Home,
  Headphones,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type MouseEvent } from "react";
import { useCart } from "@/providers/CartProvider";
import { useWishlist } from "@/providers/WishlistProvider";
import ProductReviews from "@/components/ProductReviews";

const tabs = ["Description", "Specification", "Return Policy"] as const;

const trustItems = [
  {
    icon: Truck,
    text: "Free shipping inside dhaka city only for Loomora Lifestyle products",
  },
  { icon: Home, text: "Home delivery all over Bangladesh" },
  { icon: CreditCard, text: "Various payment methods" },
  {
    icon: ShieldCheck,
    text: "15 Days replacement policy only for Loomora Lifestyle manufacture products",
  },
  { icon: Headphones, text: "Dedicated Customer Support" },
  { icon: BadgeCheck, text: "Verified and Trusted Sellers" },
];

export default function ProductDetail({
  product,
  related,
  price: priceOverride,
  oldPrice: oldPriceOverride,
}: {
  product: CatalogProduct;
  related: CatalogProduct[];
  price?: number;
  oldPrice?: number;
}) {
  const price = priceOverride ?? product.price;
  const oldPrice = oldPriceOverride ?? product.oldPrice;
  const save = oldPrice && oldPrice > price ? oldPrice - price : null;

  const sizes = product.sizes ?? ["38", "40", "42", "44"];
  const stock = (product.price % 7) + 3;

  // Gallery Thumbnails (using primary image plus related angles/views)
  const galleryImages = [
    product.src,
    ...(related.slice(0, 4).map((r) => r.src)),
  ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const activeImage = galleryImages[activeImageIndex] || product.src;

  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Description");
  const [added, setAdded] = useState(false);

  // Side-by-Side Magnifier Zoom States
  const [isZooming, setIsZooming] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const LENS_SIZE = 140; // width & height of the moving lens
  const ZOOM_FACTOR = 2.8; // magnification power

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const container = imageContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    // Calculate clamped lens coordinates
    const halfLens = LENS_SIZE / 2;
    let lensX = cursorX - halfLens;
    let lensY = cursorY - halfLens;

    const maxX = rect.width - LENS_SIZE;
    const maxY = rect.height - LENS_SIZE;

    if (lensX < 0) lensX = 0;
    if (lensX > maxX) lensX = maxX;
    if (lensY < 0) lensY = 0;
    if (lensY > maxY) lensY = maxY;

    setLensPos({ x: lensX, y: lensY });

    // Calculate percentage for high-res zoom background position
    const percentX = (lensX / maxX) * 100;
    const percentY = (lensY / maxY) * 100;
    setBgPos({ x: percentX, y: percentY });
  };

  const router = useRouter();
  const { addItem } = useCart();
  const { has: isInWishlist, toggle: toggleWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.id);

  const cartPayload = {
    id: product.id,
    name: product.name,
    price,
    oldPrice,
    color: product.color,
    colorName: product.colorName,
    src: product.src,
    size: selectedSize,
    qty,
  };

  const handleAddToCart = () => {
    addItem(cartPayload);
    setAdded(true);
    setTimeout(() => setAdded(false), 2600);
  };

  const handleBuyNow = () => {
    addItem(cartPayload);
    router.push("/checkout");
  };

  const scrollThumbnails = (dir: 1 | -1) => {
    setActiveImageIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return galleryImages.length - 1;
      if (next >= galleryImages.length) return 0;
      return next;
    });
  };

  const specRows: [string, string][] = [
    ["Brand", product.brand],
    ["Category", product.category],
    ["Color", product.colorName ?? product.color],
    ["Fabric", "100% Premium Combed Cotton & Lycra"],
    ["Fit Type", "Regular / Slim Fit"],
    ["Sleeve", "Full / Half Sleeve"],
    ["SKU", `LOOM-${product.id.toUpperCase()}`],
  ];

  return (
    <div className="w-full bg-white font-sans pb-16">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-zinc-200">
        <div className="mx-auto max-w-[1440px] px-4 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-zinc-500 sm:text-sm">
            <Link href="/" className="transition-colors hover:text-[#12509b]">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/men"
              className="transition-colors hover:text-[#12509b]"
            >
              {product.category.split(" ")[0]}
            </Link>
            <span>/</span>
            <span className="truncate font-semibold text-zinc-800">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Grid: 3 Columns (Gallery with Zoom | Product Info | Trust Sidebar) */}
      <div className="mx-auto max-w-[1440px] px-4 py-6">
        <div className="grid gap-8 lg:grid-cols-[28rem_minmax(0,1fr)_18rem] xl:grid-cols-[32rem_minmax(0,1fr)_20rem]">
          {/* 1. PRODUCT GALLERY (Interactive Magnifier Zoom & Thumbnail Row) */}
          <div className="relative">
            {/* Main Image Box with Lens */}
            <div
              ref={imageContainerRef}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
              className="relative aspect-square w-full cursor-crosshair overflow-hidden rounded-2xl border border-zinc-200 bg-[#f7f7f7] shadow-sm"
            >
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 32rem, 100vw"
                className="object-cover"
              />

              {save && (
                <span className="absolute left-0 top-0 z-10 rounded-br-xl bg-gradient-to-r from-red-600 to-red-500 px-3.5 py-2 text-xs font-black text-white shadow-sm">
                  SAVE ৳ {save.toLocaleString()}
                </span>
              )}

              <span className="absolute bottom-3 right-3 z-10 hidden items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-zinc-600 shadow-md backdrop-blur-xs lg:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#12509b]" />
                Hover to zoom
              </span>

              {/* Moving Lens Box */}
              {isZooming && (
                <div
                  className="pointer-events-none absolute border border-zinc-400/80 bg-white/20 backdrop-blur-2xs shadow-inner transition-opacity duration-75"
                  style={{
                    width: `${LENS_SIZE}px`,
                    height: `${LENS_SIZE}px`,
                    left: `${lensPos.x}px`,
                    top: `${lensPos.y}px`,
                  }}
                />
              )}
            </div>

            {/* High-Resolution Side-by-Side Popout Zoom Box (Desktop) */}
            {isZooming && (
              <div className="pointer-events-none absolute left-[102%] top-0 z-50 hidden h-[480px] w-[540px] overflow-hidden rounded-lg border-2 border-zinc-300 bg-white shadow-2xl lg:block">
                <div
                  className="h-full w-full bg-no-repeat"
                  style={{
                    backgroundImage: `url(${activeImage})`,
                    backgroundSize: `${ZOOM_FACTOR * 100}%`,
                    backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
                  }}
                />
              </div>
            )}

            {/* Thumbnail Carousel Gallery */}
            <div className="mt-3.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollThumbnails(-1)}
                aria-label="Previous thumbnail"
                className="flex h-10 w-7 shrink-0 items-center justify-center rounded border border-zinc-300 bg-white text-zinc-600 transition-colors hover:bg-zinc-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {galleryImages.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    onMouseEnter={() => setActiveImageIndex(idx)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded border transition-all ${
                      activeImageIndex === idx
                        ? "border-2 border-[#12509b] ring-1 ring-[#12509b]/20"
                        : "border-zinc-200 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollThumbnails(1)}
                aria-label="Next thumbnail"
                className="flex h-10 w-7 shrink-0 items-center justify-center rounded border border-zinc-300 bg-white text-zinc-600 transition-colors hover:bg-zinc-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 2. PRODUCT INFO & DETAILS */}
          <div className="min-w-0 space-y-4">
            {/* Title & Wishlist */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-zinc-900 sm:text-3xl">
                  {product.name}
                </h1>
                <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#12509b]">
                  Available Online Only
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Brand : <span className="font-semibold text-zinc-900">{product.brand}</span>
                </p>
              </div>

              <button
                type="button"
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                onClick={() => toggleWishlist(product.id)}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all ${
                  wishlisted
                    ? "border-red-200 bg-red-50 text-red-500"
                    : "border-zinc-300 text-zinc-400 hover:text-red-500 hover:border-red-200"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`}
                />
              </button>
            </div>

            <hr className="border-zinc-200" />

            {/* Price Row (with Green Accent Line) */}
            <div className="flex items-center gap-3.5">
              <span className="border-l-4 border-emerald-600 pl-3.5 text-3xl font-black text-zinc-900 sm:text-4xl">
                ৳ {price}
              </span>
              {oldPrice && (
                <span className="text-lg text-zinc-400 line-through">
                  ৳ {oldPrice}
                </span>
              )}
              {save && (
                <span className="rounded bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
                  Save ৳ {save}
                </span>
              )}
            </div>

            {/* SKU & Sold By */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1.5 text-sm text-zinc-700">
              <span>
                SKU/Style : <strong className="font-bold text-zinc-900">LOOM-{product.id.toUpperCase()}</strong>
              </span>
              <span>
                Sold by : <strong className="font-bold text-zinc-900">{product.brand}</strong>{" "}
                <span className="cursor-pointer font-semibold text-[#12509b] hover:underline">
                  (Visit Online Store)
                </span>
              </span>
            </div>

            {/* Color Swatch */}
            <div className="pt-2 text-sm text-zinc-700">
              <span>Color : <strong className="font-bold text-zinc-900">{product.colorName || "Standard"}</strong></span>
              <div className="mt-2 flex h-14 w-14 items-center justify-center rounded border-2 border-[#12509b] p-1 shadow-xs">
                <span
                  className="h-full w-full rounded-xs border border-black/10"
                  style={{ backgroundColor: product.color }}
                />
              </div>
            </div>

            {/* Size Selector */}
            <div className="pt-2">
              <div className="text-sm font-bold text-zinc-900">Size :</div>
              <div className="mt-2 flex flex-wrap gap-2.5">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`flex h-10 min-w-10 items-center justify-center rounded border px-4 text-sm font-bold transition-all ${
                      selectedSize === size
                        ? "border-[#12509b] bg-[#12509b] text-white shadow-xs"
                        : "border-zinc-300 bg-white text-zinc-700 hover:border-[#12509b] hover:text-[#12509b]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Count */}
            <p className="text-sm text-zinc-700">
              In Stock : <strong className="font-bold text-zinc-900">{stock}</strong>
            </p>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-3 pt-1 text-sm font-bold text-zinc-900">
              <span>Quantity :</span>
              <div className="flex items-center gap-2 rounded-full border-2 border-[#12509b] px-2 py-1">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[#12509b] hover:bg-[#12509b]/10"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-6 text-center text-sm font-bold text-zinc-900">
                  {qty}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((prev) => prev + 1)}
                  className="flex h-6 w-6 items-center justify-center rounded-full text-[#12509b] hover:bg-[#12509b]/10"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons (ADD TO CART & BUY NOW) */}
            <div className="flex flex-col gap-3.5 pt-3 sm:flex-row">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 rounded-md bg-zinc-400 py-3.5 text-sm font-bold tracking-wider text-white transition-colors hover:bg-zinc-500 active:scale-[0.99]"
              >
                ADD TO CART
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 rounded-md bg-[#12509b] py-3.5 text-sm font-bold tracking-wider text-white transition-opacity hover:opacity-90 active:scale-[0.99]"
              >
                BUY NOW
              </button>
            </div>

            {/* SKU, Category & Social Media Share */}
            <div className="flex flex-wrap items-start justify-between gap-4 border-t border-zinc-200 pt-5 text-sm text-zinc-700">
              <div className="space-y-1">
                <p>
                  Seller Product SKU :{" "}
                  <strong className="font-bold text-zinc-900">
                    {product.id}-{product.colorName?.toLowerCase().replace(/\s+/g, "-") || "main"}
                  </strong>
                </p>
                <p>
                  Category :{" "}
                  <Link
                    href="/men"
                    className="font-bold text-[#12509b] hover:underline"
                  >
                    {product.category}
                  </Link>
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-[#12509b]">
                  Share With Social Media
                </p>
                <div className="mt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    aria-label="Share on Facebook"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1877f2] text-sm font-bold text-white transition-transform hover:scale-110"
                  >
                    f
                  </button>
                  <button
                    type="button"
                    aria-label="Share on X"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-bold text-white transition-transform hover:scale-110"
                  >
                    𝕏
                  </button>
                  <button
                    type="button"
                    aria-label="Share on WhatsApp"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25d366] text-white transition-transform hover:scale-110"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. RIGHT SIDEBAR (Value Props & Recently Viewed) */}
          <aside className="space-y-4">
            {/* Trust List */}
            <div className="space-y-3.5 rounded-md border border-zinc-200 bg-[#fbfbfb] p-4 text-xs sm:text-sm text-zinc-700">
              {trustItems.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#12509b]" />
                  <p className="leading-snug">{text}</p>
                </div>
              ))}

              <div className="border-t border-zinc-200 pt-3">
                <p className="mb-2 text-xs font-bold text-zinc-800">
                  Accepted Payment Methods:
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  <div className="flex h-7 items-center justify-center rounded border border-zinc-200 bg-white px-2 shadow-2xs">
                    <Image
                      src="/hero/bkash.png"
                      alt="bKash"
                      width={48}
                      height={18}
                      className="h-4 w-auto object-contain"
                    />
                  </div>
                  <div className="flex h-7 items-center justify-center rounded border border-zinc-200 bg-white px-2 shadow-2xs">
                    <Image
                      src="/hero/nagad.jpg"
                      alt="Nagad"
                      width={48}
                      height={18}
                      className="h-4 w-auto object-contain rounded-xs"
                    />
                  </div>
                  <span className="flex h-7 items-center justify-center rounded border border-zinc-200 bg-white px-2 text-[11px] font-bold text-[#1a1f71]">
                    VISA
                  </span>
                  <span className="flex h-7 items-center justify-center rounded border border-zinc-200 bg-white px-2 text-[11px] font-bold text-[#eb001b]">
                    Mastercard
                  </span>
                  <span className="flex h-7 items-center justify-center rounded border border-zinc-200 bg-white px-2 text-[11px] font-bold text-emerald-700">
                    COD
                  </span>
                </div>
              </div>
            </div>

            {/* Recently Viewed Box (Exact SaRa Style) */}
            {related[0] && (
              <div className="rounded-md border border-zinc-200 bg-white p-3.5 text-center shadow-2xs">
                <h3 className="text-sm font-bold text-zinc-900">
                  Recently Viewed
                </h3>
                <Link
                  href={`/product/${related[0].id}`}
                  className="group mt-3 block"
                >
                  <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded bg-[#f4f4f4]">
                    {related[0].oldPrice && (
                      <span className="absolute left-0 top-0 z-10 rounded-br bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        Save ৳ {related[0].oldPrice - related[0].price}
                      </span>
                    )}
                    <Image
                      src={related[0].src}
                      alt={related[0].name}
                      fill
                      sizes="16rem"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-2.5 flex items-baseline justify-center gap-1.5">
                    <span className="text-sm font-bold text-zinc-900">
                      ৳ {related[0].price}
                    </span>
                    {related[0].oldPrice && (
                      <span className="text-xs text-zinc-400 line-through">
                        ৳ {related[0].oldPrice}
                      </span>
                    )}
                  </div>

                  <span
                    aria-hidden
                    className="mx-auto mt-1.5 block h-3 w-3 rounded-full border border-black/10"
                    style={{ backgroundColor: related[0].color }}
                  />

                  <p className="mt-1.5 line-clamp-2 text-xs font-medium text-zinc-700 transition-colors group-hover:text-[#12509b]">
                    {related[0].name}
                  </p>
                </Link>
              </div>
            )}
          </aside>
        </div>

        {/* BOTTOM TABS: Description | Specification | Return Policy */}
        <div className="mt-14">
          <div className="flex gap-8 border-b-2 border-zinc-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`-mb-[2px] border-b-3 pb-3 text-base sm:text-lg font-bold tracking-wide transition-all ${
                  activeTab === tab
                    ? "border-[#12509b] text-[#12509b]"
                    : "border-transparent text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-zinc-200/90 bg-white p-6 sm:p-8 text-sm sm:text-base leading-relaxed text-zinc-700 shadow-2xs">
            {activeTab === "Description" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                    Product Overview:
                  </h3>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-zinc-700">
                    Experience premium comfort with the <strong className="font-semibold text-zinc-900">{product.name}</strong> from{" "}
                    <strong className="font-semibold text-zinc-900">{product.brand}</strong>. Designed with high quality fabrics, precision tailoring,
                    and a modern silhouette, making it an ideal choice for everyday wear, work,
                    and special celebrations.
                  </p>
                </div>

                <div className="pt-2">
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900">
                    Key Features:
                  </h3>
                  <ul className="mt-2 list-disc pl-6 space-y-2 text-sm sm:text-base text-zinc-700">
                    <li>Premium combed cotton blend for superior breathability and all-day ease</li>
                    <li>Durable double-needle stitching and pre-shrunk fabric construction</li>
                    <li>True to size modern regular fit that flatters your frame</li>
                    <li>Long-lasting color fastness and easy machine wash friendly</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "Specification" && (
              <table className="w-full text-sm sm:text-base">
                <tbody>
                  {specRows.map(([label, value]) => (
                    <tr key={label} className="border-b border-zinc-100 last:border-0">
                      <td className="w-48 py-3.5 font-bold text-zinc-900">
                        {label}
                      </td>
                      <td className="py-3.5 text-zinc-700">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === "Return Policy" && (
              <div className="space-y-3.5 text-sm sm:text-base text-zinc-700">
                <p>
                  Returns & exchanges are accepted within <strong className="font-bold text-zinc-900">15 days</strong> of
                  delivery for items in original unused condition with intact packaging and tags.
                </p>
                <p>
                  For any defective or wrong item received, please contact our 24/7
                  customer support team within 48 hours for an immediate free replacement or refund.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* CUSTOMER REVIEWS */}
        <ProductReviews productId={product.id} />

        {/* YOU MAY ALSO LIKE (RELATED PRODUCTS) */}
        <div className="mt-12">
          <h2 className="text-lg font-bold text-zinc-900 sm:text-xl">
            You May Also Like
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="group flex flex-col overflow-hidden rounded-md border border-zinc-200 bg-white p-2.5 text-center shadow-2xs hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded bg-[#f4f4f4]">
                  <Image
                    src={item.src}
                    alt={item.name}
                    fill
                    sizes="12rem"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-2 flex items-baseline justify-center gap-1.5">
                  <span className="text-xs font-bold text-zinc-900">
                    ৳ {item.price}
                  </span>
                  {item.oldPrice && (
                    <span className="text-[10px] text-zinc-400 line-through">
                      ৳ {item.oldPrice}
                    </span>
                  )}
                </div>
                <span
                  aria-hidden
                  className="mx-auto mt-1 block h-2.5 w-2.5 rounded-full border border-black/10"
                  style={{ backgroundColor: item.color }}
                />
                <p className="mt-1 line-clamp-2 text-xs text-zinc-700 transition-colors group-hover:text-[#12509b]">
                  {item.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Add To Cart Toast */}
      {added && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg bg-zinc-900 px-4 py-3 text-xs font-medium text-white shadow-2xl">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="h-3.5 w-3.5 stroke-[3]" />
          </span>
          <span>
            Added <strong>{product.name}</strong> to your cart!
          </span>
          <Link
            href="/cart"
            className="ml-1 rounded bg-[#12509b] px-2 py-1 text-[11px] font-bold text-white transition-opacity hover:opacity-90"
          >
            View Cart
          </Link>
        </div>
      )}
    </div>
  );
}
