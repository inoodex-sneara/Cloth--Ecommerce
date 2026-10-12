"use client";

import { getMyOrders, loadToken, type MyOrder } from "@/lib/api/auth";
import { ChevronDown, Package, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const statusStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-blue-100 text-blue-700",
  packed: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  in_transit: "bg-indigo-100 text-indigo-700",
  out_for_delivery: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusLabel = (status: string) =>
  status
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const formatDate = (iso: string | null) => {
  if (!iso) return "";
  const ts = Date.parse(iso);
  if (Number.isNaN(ts)) return "";
  return new Date(ts).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function OrderCard({ order }: { order: MyOrder }) {
  const [open, setOpen] = useState(false);
  const badge =
    statusStyles[order.status] ?? "bg-zinc-100 text-zinc-700";

  return (
    <li className="rounded-xl border border-zinc-200 bg-white shadow-2xs">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-bold text-zinc-900">
              {order.orderNumber}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badge}`}
            >
              {statusLabel(order.status)}
            </span>
            {order.paymentStatus !== "paid" && (
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-500">
                {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            {formatDate(order.createdAt)} · {order.itemsCount}{" "}
            {order.itemsCount === 1 ? "item" : "items"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-base font-black text-zinc-900">
            ৳ {order.total.toLocaleString()}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {open && (
        <div className="border-t border-zinc-100 px-4 pb-4 pt-3">
          <ul className="space-y-2">
            {order.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 text-sm"
              >
                <span className="min-w-0 flex-1 truncate text-zinc-700">
                  {item.productName}
                </span>
                <span className="text-xs text-zinc-500">
                  × {item.quantity}
                </span>
                <span className="font-semibold text-zinc-900">
                  ৳ {item.total.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={`/order-tracking?order=${encodeURIComponent(order.orderNumber)}`}
              className="flex items-center gap-1.5 rounded-md border border-[#12509b]/30 bg-[#12509b]/5 px-3 py-1.5 text-xs font-bold text-[#12509b] transition-colors hover:bg-[#12509b] hover:text-white"
            >
              <Truck className="h-3.5 w-3.5" />
              TRACK ORDER
            </Link>
          </div>
        </div>
      )}
    </li>
  );
}

export default function AccountOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (!loadToken()) {
      router.replace("/account");
      return;
    }
    let cancelled = false;
    getMyOrders(page)
      .then((res) => {
        if (cancelled) return;
        setOrders(res.orders);
        setLastPage(res.lastPage);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof Error && err.message === "Not signed in") {
          router.replace("/account");
          return;
        }
        setErrMsg(
          err instanceof Error && err.message
            ? err.message
            : "Orders load korte parini."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, router]);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <nav className="flex items-center gap-1.5 text-sm text-zinc-500">
        <Link href="/" className="transition-colors hover:text-[#12509b]">
          Home
        </Link>
        <span>/</span>
        <Link href="/account" className="transition-colors hover:text-[#12509b]">
          Account
        </Link>
        <span>/</span>
        <span className="font-semibold text-zinc-800">My Orders</span>
      </nav>

      <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-zinc-900">
        My Orders
      </h1>

      {loading && (
        <div className="mt-5 animate-pulse space-y-3">
          <div className="h-20 rounded-xl bg-zinc-100" />
          <div className="h-20 rounded-xl bg-zinc-100" />
          <div className="h-20 rounded-xl bg-zinc-100" />
        </div>
      )}

      {!loading && errMsg && (
        <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
          {errMsg}
        </div>
      )}

      {!loading && !errMsg && orders.length === 0 && (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center">
          <Package className="h-10 w-10 text-zinc-300" />
          <p className="mt-3 text-sm font-semibold text-zinc-700">
            Kono order pai ni.
          </p>
          <Link
            href="/"
            className="mt-4 rounded-md bg-[#12509b] px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            START SHOPPING
          </Link>
        </div>
      )}

      {!loading && !errMsg && orders.length > 0 && (
        <>
          <ul className="mt-5 space-y-3">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </ul>

          {lastPage > 1 && (
            <div className="mt-5 flex items-center justify-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-bold text-zinc-700 transition-colors hover:border-[#12509b] hover:text-[#12509b] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs text-zinc-500">
                Page {page} of {lastPage}
              </span>
              <button
                type="button"
                disabled={page >= lastPage}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-zinc-300 px-3 py-1.5 text-xs font-bold text-zinc-700 transition-colors hover:border-[#12509b] hover:text-[#12509b] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
