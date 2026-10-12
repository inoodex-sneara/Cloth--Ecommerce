"use client";

import { trackOrder, type TrackedOrder } from "@/lib/api/track";
import { mediaUrl } from "@/lib/api/media";
import {
  BadgeCheck,
  Ban,
  Check,
  ClipboardCheck,
  Home,
  MapPin,
  PackageCheck,
  Search,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";

const HOUR = 3600_000;
const DAY = 24 * HOUR;

const steps = [
  {
    label: "Order Placed",
    desc: "We have received your order",
    Icon: ClipboardCheck,
  },
  {
    label: "Order Confirmed",
    desc: "Order verified by our team",
    Icon: BadgeCheck,
  },
  {
    label: "Packed & Ready",
    desc: "Packed in Loomora packaging",
    Icon: PackageCheck,
  },
  {
    label: "Shipped — In Transit",
    desc: "On the way to your city",
    Icon: Truck,
  },
  {
    label: "Out for Delivery",
    desc: "Rider is on the way to you",
    Icon: MapPin,
  },
  {
    label: "Delivered",
    desc: "Package handed to customer",
    Icon: Home,
  },
];

const STATUS_STEP: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  processing: 2,
  packed: 2,
  shipped: 3,
  in_transit: 3,
  out_for_delivery: 4,
  delivered: 5,
};

const paymentLabels: Record<string, string> = {
  cod: "Cash on Delivery",
  bkash: "bKash",
  nagad: "Nagad",
  rocket: "Rocket",
  card: "Card",
  bank: "Bank Transfer",
  online: "Online Payment",
};

const statusLabel = (status: string) =>
  status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const parseTs = (iso: string | null): number | null => {
  if (!iso) return null;
  const ts = Date.parse(iso);
  return Number.isNaN(ts) ? null : ts;
};

const formatDateTime = (ts: number) =>
  new Date(ts).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatDate = (ts: number) =>
  new Date(ts).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<TrackedOrder | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const search = async (id: string, tel: string) => {
    const cleanId = id.trim();
    if (!cleanId || loading) return;
    setLoading(true);
    setErrMsg("");
    setSearched(false);
    setResult(null);
    try {
      const tracked = await trackOrder(cleanId, tel.trim() || undefined);
      setResult(tracked);
      setSearched(true);
    } catch (err) {
      setErrMsg(
        err instanceof Error && err.message
          ? err.message
          : "Order track korte parini. Abar try koren."
      );
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void search(orderId, phone);
  };

  const canSearch = orderId.trim().length > 0 && !loading;

  const stepIndex = result
    ? (STATUS_STEP[result.status] ?? (result.status === "cancelled" ? -1 : 0))
    : 0;
  const cancelled = result?.status === "cancelled";
  const delivered = stepIndex >= steps.length - 1;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-zinc-500">
        <Link href="/" className="transition-colors hover:text-[#12509b]">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-zinc-800">Order Tracking</span>
      </nav>

      {/* Search Card */}
      <form
        onSubmit={handleSearch}
        className="mt-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <label
              htmlFor="order-id"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-700"
            >
              Order ID
            </label>
            <input
              id="order-id"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ORD-20261011-QGYY"
              className="mt-1.5 h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#12509b] focus:ring-2 focus:ring-[#12509b]/10"
            />
          </div>
          <div>
            <label
              htmlFor="order-phone"
              className="block text-xs font-bold uppercase tracking-wider text-zinc-700"
            >
              Phone Number{" "}
              <span className="font-normal normal-case text-zinc-400">
                (optional)
              </span>
            </label>
            <input
              id="order-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="mt-1.5 h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#12509b] focus:ring-2 focus:ring-[#12509b]/10"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={!canSearch}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#12509b] px-6 text-sm font-bold tracking-wide text-white shadow-md shadow-[#12509b]/25 transition-all hover:bg-[#1660b8] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Search className="h-4 w-4" />
              {loading ? "TRACKING..." : "TRACK ORDER"}
            </button>
          </div>
        </div>

      </form>

      {/* Error */}
      {searched && !result && errMsg && (
        <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
          <b className="font-bold">Order not found.</b> {errMsg} Order ID ti
          apnar confirmation SMS / invoice e ache — example:{" "}
          <span className="font-mono">ORD-20261011-QGYY</span>. Still problem
          hole{" "}
          <a href="tel:01712345678" className="font-semibold underline">
            01712-345678
          </a>{" "}
          e call korun.
        </div>
      )}

      {/* Result */}
      {result &&
        (() => {
          const placedTs = parseTs(result.createdAt) ?? 0;
          const shippedTs = parseTs(result.shippedAt);
          const deliveredTs = parseTs(result.deliveredAt);
          const inDhaka = /dhaka/i.test(
            `${result.customer.city} ${result.customer.address}`
          );
          const etaFrom = placedTs + (inDhaka ? 3 : 5) * DAY;
          const etaTo = placedTs + (inDhaka ? 5 : 7) * DAY;

          return (
            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]">
              {/* Timeline */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Order
                    </p>
                    <p className="text-lg font-extrabold tracking-tight text-zinc-900">
                      {result.orderNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        cancelled
                          ? "bg-red-100 text-red-700"
                          : delivered
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-blue-100 text-[#12509b]"
                      }`}
                    >
                      {cancelled ? "Cancelled" : statusLabel(result.status)}
                    </span>
                    <p className="mt-1 text-xs text-zinc-500">
                      {placedTs
                        ? `Placed ${formatDateTime(placedTs)}`
                        : "Placed recently"}
                    </p>
                  </div>
                </div>

                {cancelled ? (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <Ban className="h-4 w-4" />
                    Ei order ta cancel kora hoyeche. Details hole{" "}
                    <a href="tel:01712345678" className="font-semibold underline">
                      01712-345678
                    </a>{" "}
                    e jogajog korun.
                  </div>
                ) : (
                  placedTs > 0 &&
                  !delivered && (
                    <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                      <MapPin className="h-4 w-4 text-[#12509b]" />
                      Estimated delivery:{" "}
                      <b className="font-bold text-zinc-900">
                        {formatDate(etaFrom)} – {formatDate(etaTo)}
                      </b>
                      <span className="text-zinc-400">
                        ({inDhaka ? "Inside Dhaka" : "Outside Dhaka"})
                      </span>
                    </div>
                  )
                )}

                {result.courierTrackingCode && (
                  <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-[#12509b]/20 bg-[#12509b]/5 px-4 py-3 text-sm text-zinc-700">
                    <Truck className="h-4 w-4 text-[#12509b]" />
                    {result.courierProvider && (
                      <b className="font-bold text-zinc-900">
                        {result.courierProvider}
                      </b>
                    )}
                    Tracking:{" "}
                    <b className="font-mono text-[#12509b]">
                      {result.courierTrackingCode}
                    </b>
                  </div>
                )}

                <ol className="mt-6">
                  {steps.map((step, index) => {
                    const done = !cancelled && index < stepIndex;
                    const active = !cancelled && index === stepIndex;
                    const reachable = done || active;
                    const { Icon } = step;
                    const stepTs =
                      index === 0
                        ? placedTs
                        : index === 3
                          ? shippedTs
                          : index === 5
                            ? deliveredTs
                            : null;

                    return (
                      <li key={step.label} className="relative flex gap-4 pb-7 last:pb-0">
                        {index < steps.length - 1 && (
                          <span
                            aria-hidden
                            className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-0.5 bg-zinc-200"
                          >
                            <span
                              className={`block w-full bg-[#12509b] transition-all ${
                                done ? "h-full" : "h-0"
                              }`}
                            />
                          </span>
                        )}

                        <span
                          className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                            active
                              ? "border-[#12509b] bg-[#12509b] text-white ring-4 ring-[#12509b]/15"
                              : done
                                ? "border-[#12509b] bg-[#12509b] text-white"
                                : "border-zinc-200 bg-white text-zinc-300"
                          }`}
                        >
                          {done ? (
                            <Check className="h-5 w-5 stroke-[3]" />
                          ) : (
                            <Icon className="h-5 w-5" />
                          )}
                        </span>

                        <div className="min-w-0 pt-1">
                          <p
                            className={`text-sm font-bold ${
                              reachable ? "text-zinc-900" : "text-zinc-400"
                            }`}
                          >
                            {step.label}
                          </p>
                          <p
                            className={`mt-0.5 text-xs ${
                              reachable ? "text-zinc-500" : "text-zinc-400"
                            }`}
                          >
                            {step.desc}
                          </p>
                          {done && stepTs && (
                            <p className="mt-1 text-[11px] font-medium text-emerald-600">
                              {formatDateTime(stepTs)}
                            </p>
                          )}
                          {active && !delivered && (
                            <p className="mt-1 text-[11px] font-semibold text-[#12509b]">
                              In progress…
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Summary */}
              <div className="space-y-5">
                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                    Order Summary
                  </h2>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Payment</span>
                      <b className="text-zinc-900">
                        {paymentLabels[result.paymentMethod] ??
                          result.paymentMethod}
                      </b>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Payment Status</span>
                      <b
                        className={
                          result.paymentStatus === "paid"
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }
                      >
                        {result.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                      </b>
                    </div>
                    {result.discount > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Discount</span>
                        <b className="text-emerald-600">
                          − ৳ {result.discount.toLocaleString()}
                        </b>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-500">Shipping</span>
                      <b className="text-zinc-900">
                        {result.shippingCost === 0
                          ? "Free"
                          : `৳ ${result.shippingCost.toLocaleString()}`}
                      </b>
                    </div>
                    <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
                      <span className="text-zinc-500">Total</span>
                      <b className="text-base text-zinc-900">
                        ৳ {result.total.toLocaleString()}
                      </b>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl bg-zinc-50 p-3.5 text-xs leading-relaxed text-zinc-600">
                    <b className="font-bold text-zinc-800">
                      {result.customer.name || "Customer"}
                    </b>
                    <br />
                    {result.customer.address}
                    {result.customer.area && `, ${result.customer.area}`}
                    {result.customer.city && `, ${result.customer.city}`}
                    {result.customer.phone && (
                      <>
                        <br />📞 {result.customer.phone}
                      </>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
                    Items ({result.items.length})
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {result.items.map((item, index) => {
                      const src = mediaUrl(item.image);
                      return (
                        <li
                          key={`${item.sku ?? item.productName}-${index}`}
                          className="flex gap-3"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                            {src ? (
                              <Image
                                src={src}
                                alt={item.productName}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-zinc-400">
                                N/A
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-xs font-medium leading-snug text-zinc-700">
                              {item.productName}
                            </p>
                            <p className="mt-1 text-[11px] text-zinc-500">
                              {item.sku && `SKU ${item.sku} · `}
                              Qty {item.quantity}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-zinc-900">
                            ৳ {item.total.toLocaleString()}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
