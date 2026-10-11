"use client";

import { validateCoupon, type CouponItem } from "@/lib/api/coupons";
import { placeOrder } from "@/lib/api/orders";
import { saveOrder } from "@/lib/orders";
import { useCart, type CartItem } from "@/providers/CartProvider";
import {
  Banknote,
  CheckCircle2,
  ChevronRight,
  Download,
  Home,
  Minus,
  Plus,
  Printer,
  Smartphone,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";

const fieldClass =
  "mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-800 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#12509b]";

const labelClass = "block text-sm font-bold text-zinc-800";

const districts = [
  "Dhaka",
  "Chattogram",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Gazipur",
  "Narayanganj",
];

const areas = [
  "Dhanmondi",
  "Gulshan",
  "Mirpur",
  "Uttara",
  "Mohammadpur",
  "Motijheel",
  "Banani",
  "Bashundhara R/A",
  "Badda",
  "Farmgate",
  "Banasree",
  "Old Dhaka",
];

const policyNotes = [
  "ঢাকা সিটির ভিতরে ডেলিভারির সময়সীমা ৩-৫ কর্মদিবস এবং ঢাকা সিটির বাইরে ৫-৭ কর্মদিবস।",
  "লূমোরা লাইফস্টাইল ডেলিভারি চার্জ: ঢাকা সিটির মধ্যে - ১৪৮ টাকার উপরে অর্ডার করলে ফ্রী ডেলিভারি এবং ১৪৮ টাকার নিচে অর্ডার করলে ডেলিভারি চার্জ ১০০ টাকা (শুধুমাত্র লূমোরা লাইফস্টাইল মার্কেটপ্লেসের প্রোডাক্টের ক্ষেত্রে প্রযোজ্য) এবং ঢাকা সিটির বাইরে - ১০০ টাকা।",
  "লূমোরা লাইফস্টাইল এবং মার্কেটপ্লেস ডিসকাউন্ট প্রোডাক্ট অর্ডারের ক্ষেত্রে ডেলিভারি চার্জ প্রযোজ্য।",
  "মার্কেটপ্লেস সেলার প্রোডাক্টের ক্ষেত্রে ঢাকা সিটির মধ্যে ডেলিভারি চার্জ ৬০ টাকা এবং ঢাকা সিটির বাইরে ডেলিভারি চার্জ ১২০ টাকা।",
  "একাধিক সেলারের প্রোডাক্টের ক্ষেত্রে আলাদা ডেলিভারি চার্জ প্রযোজ্য হবে।",
  "লূমোরা লাইফস্টাইল এবং মার্কেটপ্লেস সেলারদের পণ্যের পরিমাণ ও ওজনের উপর ভিত্তি করে ডেলিভারি চার্জ পরিবর্তন হবে।",
  "লূমোরার ৬০% ডিসকাউন্ট প্রোডাক্টের অবশ্যই ডেলিভারি পারসনের সামনে চেক করে নিতে হবে। ৬০% ডিসকাউন্টের প্রোডাক্টের ডেলিভারি রিসিভ করার পর রিটার্ন/রিপ্লেসমেন্ট/রিফান্ড প্রযোজ্য হবে না।",
  "লূমোরার ৬০% ডিসকাউন্টের প্রোডাক্ট অর্ডারের ক্ষেত্রে অন্য কোনো প্রকার অফার (গ্রাহককোড/প্রিভিলেজ কাস্টমার এবং ১০% কার্ড পেমেন্ট অফারসহ) প্রযোজ্য থাকবে না।",
  "অর্ডার কনফার্মেশন হবার পর কোনো প্রোডাক্ট তৎক্ষণা জানিয়ে অর্ডার করা বাতিল হলে তা লূমোরা লাইফস্টাইল লিমিটেড ম্যানেজমেন্ট এর সিদ্ধান্ত অনুযায়ী রিটার্ন অথবা রিফান্ড পলিসি অনুযায়ী বিবেচনা হবে।",
  "মার্কেটপ্লেস এবং প্রোডাক্ট যে কোনো কারণে রিটার্ন করা হলে গ্রাহককে অবশ্যই ডেলিভারি চার্জ টাকা প্রদান করতে হবে।",
  "মূল্য সংযোজন কর ও সম্পর্কিত খুচরা আইন, ২০২৩ অনুযায়ী সেবার কোড ৮০৭৪ এর বাড়তি ৪.০% এবং এস. আর. নং-৫১ (২১ জানুয়ারী ২০২৫) অনুযায়ী ১০% বাড়তি আরোপিত হয়েছে।",
  "মার্কেটপ্লেস প্রোডাক্টের নিরাপত্তার জন্য ইলেকট্রনিক্স, ফ্যাশন/ওয়াচ/ব্যাগসহ অন্যান্য ক্যাটাগরির প্রোডাক্ট ডেলিভারি টাইমে চেক করে নেওয়ার কোনো সুযোগ থাকছে না (পার্সোনেল ফ্রেট বক্স ডেলিভারি)। অন্যান্য প্রোডাক্টের ক্ষেত্রে সেবার চেক করে রাখতে হবে।",
  "মার্কেটপ্লেসে প্রোডাক্টসমূহ (ইলেকট্রনিক্স, ফ্যাশন/ওয়াচ/ব্যাগ এবং অন্যান্য ক্যাটাগরির প্রোডাক্ট) ছাড়া যেসব প্রোডাক্ট চেক করে দেখে নিতে বলা হবে অবশ্যই ডেলিভারিম্যানের সামনে চেক করে নিতে হবে, ডেলিভারিম্যান চলে যাওয়ার পর কোনো রিকোয়েস্ট/অনুরোধ গ্রহণযোগ্য হবে না।",
  "মার্কেটপ্লেসে ৫ হাজার টাকা বা তার বেশি মূল্যের প্রোডাক্ট ক্যাশ অন ডেলিভারিতে অর্ডার করার পর সর্বোচ্চ অর্ডার মূল্যের ১০% অগ্রিম প্রদান করে অর্ডার কনফার্ম করতে হবে এবং বাকি টাকা ক্যাশ অন ডেলিভারিতে প্রদান করা হবে।",
  "লূমোরা লাইফস্টাইল যেকোনো সময় শর্তাবলী পরিবর্তন করার অধিকার রাখে।",
];

const bnDigits = (value: number) =>
  String(value).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

type InvoiceData = {
  items: CartItem[];
  billedSubtotal: number;
  discount: number;
  couponDiscount: number;
  couponCode?: string;
  deliveryCharge: number;
  total: number;
  date: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    area: string;
    postcode: string;
    delivery: string;
  };
};

const paymentOptions = [
  {
    id: "cod",
    label: "Cash on Delivery",
    note: "Pay when you receive the order",
    icon: Home,
  },
  {
    id: "bkash",
    label: "bKash",
    note: "Pay securely via bKash",
    icon: Smartphone,
  },
  {
    id: "nagad",
    label: "Nagad",
    note: "Pay securely via Nagad",
    icon: Banknote,
  },
];

export default function CheckoutPage() {
  const { items, subtotal, count, setQty, removeItem, clear } = useCart();
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [formValid, setFormValid] = useState(false);
  const [payment, setPayment] = useState("cod");
  const [walletNumber, setWalletNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);

  const [couponInput, setCouponInput] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [freeShipping, setFreeShipping] = useState(false);
  const [couponMsg, setCouponMsg] = useState("");
  const [couponErr, setCouponErr] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  const [placing, setPlacing] = useState(false);
  const [orderErr, setOrderErr] = useState("");

  const paymentLabel =
    paymentOptions.find((option) => option.id === payment)?.label ??
    "Cash on Delivery";

  const billedSubtotal = items.reduce(
    (sum, item) =>
      sum +
      (item.oldPrice && item.oldPrice > item.price
        ? item.oldPrice
        : item.price) *
        item.qty,
    0
  );
  const discount = billedSubtotal - subtotal;

  const [deliveryCity, setDeliveryCity] = useState("");
  const normalizedCity = deliveryCity.trim().toLowerCase();
  const insideDhaka = normalizedCity === "dhaka";
  const baseDeliveryCharge =
    normalizedCity === ""
      ? 100
      : insideDhaka
        ? subtotal >= 148
          ? 0
          : 100
        : 100;
  const deliveryCharge = freeShipping ? 0 : baseDeliveryCharge;
  const grandTotal = Math.max(0, subtotal - couponDiscount) + deliveryCharge;
  const deliveryHint = freeShipping
    ? "Free shipping applied"
    : normalizedCity === ""
      ? "Select District for exact charge"
      : insideDhaka
        ? "Inside Dhaka — free on ৳148+ orders"
        : "Outside Dhaka — flat ৳100";

  const applyCoupon = async () => {
    const code = couponInput.trim();
    if (!code || items.length === 0) return;
    setCouponLoading(true);
    setCouponErr(false);
    setCouponMsg("");
    const couponItems: CouponItem[] = items.map((item) => ({
      product_id: Number(item.id) || 0,
      quantity: item.qty,
      price: item.price,
    }));
    const result = await validateCoupon({
      code,
      subtotal,
      items: couponItems,
    });
    setCouponLoading(false);
    if (result.valid) {
      setCouponCode(result.code ?? code);
      setCouponDiscount(Math.min(result.discountAmount ?? 0, subtotal));
      setFreeShipping(result.freeShipping ?? false);
      setCouponMsg(result.message);
      setCouponErr(false);
    } else {
      setCouponCode("");
      setCouponDiscount(0);
      setFreeShipping(false);
      setCouponMsg(result.message);
      setCouponErr(true);
    }
  };

  const removeCoupon = () => {
    setCouponInput("");
    setCouponCode("");
    setCouponDiscount(0);
    setFreeShipping(false);
    setCouponMsg("");
    setCouponErr(false);
  };

  const handlePlaceOrder = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (items.length === 0 || placing) return;
    const data = new FormData(e.currentTarget);
    const wallet = String(data.get("wallet") ?? "");
    const trx = String(data.get("trxid") ?? "");
    const customer = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      address: String(data.get("address") ?? ""),
      city: String(data.get("city") ?? ""),
      area: String(data.get("area") ?? ""),
      postcode: String(data.get("postcode") ?? ""),
      delivery: String(data.get("delivery") ?? "home"),
    };

    setPlacing(true);
    setOrderErr("");
    try {
      const apiItems = items
        .map((item) => ({
          id: Number(item.id),
          qty: item.qty,
        }))
        .filter((item) => Number.isInteger(item.id) && item.id > 0);

      if (apiItems.length === 0) {
        setOrderErr("Cart e valid product nei. Abar add kore nen.");
        return;
      }

      const placed = await placeOrder({
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        area: customer.area || undefined,
        city: customer.city,
        postcode: customer.postcode || undefined,
        payment,
        wallet: wallet || undefined,
        trxid: trx || undefined,
        delivery_charge: deliveryCharge,
        coupon_code: couponCode || undefined,
        items: apiItems,
      });

      setWalletNumber(wallet);
      setTrxId(trx);
      setOrderId(placed.orderNumber);
      setInvoice({
        items,
        billedSubtotal,
        discount,
        couponDiscount,
        couponCode: couponCode || undefined,
        deliveryCharge,
        total: grandTotal,
        date: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        customer,
      });
      saveOrder({
        id: placed.orderNumber,
        placedAt: Date.now(),
        payment,
        wallet: wallet || undefined,
        trx: trx || undefined,
        total: grandTotal,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          oldPrice: item.oldPrice,
          color: item.color,
          src: item.src,
          size: item.size,
          qty: item.qty,
        })),
        customer,
      });
      setPlaced(true);
      clear();
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch (err) {
      setOrderErr(
        err instanceof Error && err.message
          ? err.message
          : "Order place korte parini. Abar try koren."
      );
    } finally {
      setPlacing(false);
    }
  };

  const downloadInvoice = async () => {
    if (!invoice || !orderId) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    const L = 48;
    const R = W - 48;
    let y = 60;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(18, 80, 155);
    doc.text("Loomora", L, y);
    const logoWidth = doc.getTextWidth("Loomora");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("LIFESTYLE LTD", L + logoWidth + 6, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(30, 30, 30);
    doc.text("INVOICE", R, y, { align: "right" });

    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(90, 90, 90);
    doc.text("House 42, Road 11, Banani, Dhaka 1213", L, y);
    doc.text(`Invoice: ${orderId}`, R, y, { align: "right" });
    y += 12;
    doc.text("support@loomora.com | 01712-345678", L, y);
    doc.text(`Date: ${invoice.date}`, R, y, { align: "right" });

    y += 16;
    doc.setDrawColor(210, 210, 210);
    doc.line(L, y, R, y);
    y += 20;

    const rightCol = L + 300;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text("Bill To", L, y);
    doc.text("Payment Details", rightCol, y);
    y += 16;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);

    const c = invoice.customer;
    const billLines = [
      c.name,
      c.phone,
      c.address,
      `${c.city}${c.area ? `, ${c.area}` : ""}${c.postcode ? ` - ${c.postcode}` : ""}`,
      `Delivery: ${c.delivery === "office" ? "Office" : "Home"}`,
    ];
    let billY = y;
    for (const line of billLines) {
      doc.text(line, L, billY);
      billY += 13;
    }

    const payLines = [
      `Method: ${paymentLabel}`,
      payment !== "cod" && walletNumber ? `Wallet: ${walletNumber}` : null,
      payment !== "cod" && trxId ? `TrxID: ${trxId}` : null,
      payment === "cod" ? "Status: Pay on Delivery" : "Status: Paid",
    ].filter(Boolean) as string[];
    let payY = y;
    for (const line of payLines) {
      doc.text(line, rightCol, payY);
      payY += 13;
    }
    y = Math.max(billY, payY) + 10;

    doc.setFillColor(18, 80, 155);
    doc.rect(L, y, R - L, 22, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("SN", L + 6, y + 14);
    doc.text("Description", L + 34, y + 14);
    doc.text("Qty", L + 330, y + 14);
    doc.text("Unit Price", L + 380, y + 14);
    doc.text("Amount", R - 6, y + 14, { align: "right" });
    y += 22;

    invoice.items.forEach((item, index) => {
      const nameLines = doc.splitTextToSize(item.name, 270) as string[];
      const descLines = [...nameLines, `Size: ${item.size}`];
      const rowH = descLines.length * 11 + 9;
      if (index % 2 === 1) {
        doc.setFillColor(245, 246, 248);
        doc.rect(L, y, R - L, rowH, "F");
      }
      doc.setTextColor(40, 40, 40);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(String(index + 1), L + 6, y + 14);
      doc.text(descLines, L + 34, y + 14);
      doc.text(String(item.qty), L + 330, y + 14);
      doc.text(item.price.toFixed(2), L + 380, y + 14);
      doc.text((item.price * item.qty).toFixed(2), R - 6, y + 14, {
        align: "right",
      });
      y += rowH;
    });

    y += 8;
    doc.setDrawColor(210, 210, 210);
    doc.line(R - 230, y, R, y);
    y += 16;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);
    doc.text("Sub-Total", R - 70, y, { align: "right" });
    doc.text(invoice.billedSubtotal.toFixed(2), R, y, { align: "right" });
    y += 13;
    doc.setTextColor(200, 30, 50);
    doc.text("Discount", R - 70, y, { align: "right" });
    doc.text(`- ${invoice.discount.toFixed(2)}`, R, y, { align: "right" });
    y += 13;
    if (invoice.couponDiscount > 0) {
      doc.text(
        `Coupon (${invoice.couponCode})`,
        R - 70,
        y,
        { align: "right" }
      );
      doc.text(`- ${invoice.couponDiscount.toFixed(2)}`, R, y, {
        align: "right",
      });
      y += 13;
    }
    doc.setTextColor(70, 70, 70);
    doc.text("Delivery Charge", R - 70, y, { align: "right" });
    doc.text(
      invoice.deliveryCharge === 0
        ? "Free"
        : invoice.deliveryCharge.toFixed(2),
      R,
      y,
      { align: "right" }
    );
    y += 17;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 30);
    doc.text("Total (BDT)", R - 70, y, { align: "right" });
    doc.text(invoice.total.toFixed(2), R, y, { align: "right" });
    y += 28;

    doc.setDrawColor(210, 210, 210);
    doc.line(L, y, R, y);
    y += 16;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for shopping with Loomora Lifestyle Ltd.", L, y);
    y += 12;
    doc.text(
      "This is a computer generated invoice and does not require a signature.",
      L,
      y
    );

    doc.save(`${orderId}-invoice.pdf`);
  };

  if (placed && invoice) {
    return (
      <div className="flex w-full flex-col items-center gap-4 bg-white px-4 py-14 text-center">
        <span className="no-print flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </span>
        <h1 className="no-print text-2xl font-extrabold text-zinc-900 sm:text-3xl">
          Order Placed Successfully!
        </h1>
        <p className="no-print text-sm text-zinc-600">
          Your order ID is{" "}
          <strong className="font-bold text-zinc-900">{orderId}</strong>. We
          will send a confirmation to your phone shortly.
        </p>
        <p className="no-print text-sm text-zinc-600">
          Payment method:{" "}
          <strong className="font-bold text-zinc-900">{paymentLabel}</strong>
          {payment !== "cod" && walletNumber && (
            <>
              {" — "}
              <strong className="font-bold text-zinc-900">
                {walletNumber}
              </strong>{" "}
              (TrxID:{" "}
              <strong className="font-bold text-zinc-900">{trxId}</strong>)
            </>
          )}
        </p>

        <div className="no-print mt-3 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={downloadInvoice}
            className="flex items-center gap-2 rounded-md bg-[#12509b] px-6 py-3 text-sm font-bold tracking-wide text-white transition-opacity hover:opacity-90"
          >
            <Download className="h-4 w-4" />
            DOWNLOAD PDF
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-md border border-zinc-300 px-6 py-3 text-sm font-bold tracking-wide text-zinc-700 transition-colors hover:border-[#12509b] hover:text-[#12509b]"
          >
            <Printer className="h-4 w-4" />
            PRINT INVOICE
          </button>
          <Link
            href="/new-in"
            className="rounded-md bg-emerald-600 px-6 py-3 text-sm font-bold tracking-wide text-white transition-opacity hover:opacity-90"
          >
            CONTINUE SHOPPING
          </Link>
          <Link
            href="/order-tracking"
            className="rounded-md border border-zinc-300 px-6 py-3 text-sm font-bold tracking-wide text-zinc-700 transition-colors hover:border-[#12509b] hover:text-[#12509b]"
          >
            TRACK ORDER
          </Link>
        </div>

        {/* Invoice */}
        <div
          id="invoice"
          className="mt-6 w-full max-w-2xl rounded-xl border border-zinc-200 bg-white p-6 text-left shadow-sm sm:p-8"
        >
          <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
            <div>
              <p className="text-2xl font-extrabold leading-none text-[#12509b]">
                Loomora
              </p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.3em] text-zinc-500">
                lifestyle ltd
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-500">
                House 42, Road 11, Banani, Dhaka 1213
                <br />
                support@loomora.com • 01712-345678
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-zinc-900">INVOICE</p>
              <p className="mt-1 text-xs text-zinc-600">
                Invoice : <b>{orderId}</b>
              </p>
              <p className="text-xs text-zinc-600">Date : {invoice.date}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
            <div>
              <p className="font-bold text-zinc-900">Bill To</p>
              <p className="mt-1 leading-relaxed text-zinc-600">
                {invoice.customer.name}
                <br />
                {invoice.customer.phone}
                <br />
                {invoice.customer.address}
                <br />
                {invoice.customer.city}
                {invoice.customer.area && `, ${invoice.customer.area}`}
                {invoice.customer.postcode && ` - ${invoice.customer.postcode}`}
                <br />
                Delivery :{" "}
                {invoice.customer.delivery === "office" ? "Office" : "Home"}
              </p>
            </div>
            <div>
              <p className="font-bold text-zinc-900">Payment Details</p>
              <p className="mt-1 leading-relaxed text-zinc-600">
                Method : {paymentLabel}
                <br />
                {payment !== "cod" && walletNumber && (
                  <>
                    Wallet : {walletNumber}
                    <br />
                  </>
                )}
                {payment !== "cod" && trxId && (
                  <>
                    TrxID : {trxId}
                    <br />
                  </>
                )}
                Status : {payment === "cod" ? "Pay on Delivery" : "Paid"}
              </p>
            </div>
          </div>

          <table className="mt-5 w-full text-left text-xs">
            <thead>
              <tr className="bg-[#12509b] text-white">
                <th className="rounded-l px-2 py-2 font-bold">SN</th>
                <th className="px-2 py-2 font-bold">Description</th>
                <th className="px-2 py-2 text-center font-bold">Qty</th>
                <th className="px-2 py-2 text-right font-bold">Unit Price</th>
                <th className="rounded-r px-2 py-2 text-right font-bold">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {invoice.items.map((item, index) => (
                <tr key={item.key}>
                  <td className="px-2 py-2 text-zinc-600">{index + 1}</td>
                  <td className="px-2 py-2 text-zinc-800">
                    <span className="font-semibold">{item.name}</span>
                    <span className="block text-[11px] text-zinc-500">
                      Size : {item.size} • Color : {item.colorName ?? "-"}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-center text-zinc-700">
                    {item.qty}
                  </td>
                  <td className="px-2 py-2 text-right text-zinc-700">
                    ৳ {item.price.toLocaleString()}
                  </td>
                  <td className="px-2 py-2 text-right font-semibold text-zinc-900">
                    ৳ {(item.price * item.qty).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600">
                <span>Sub-Total</span>
                <span>৳ {invoice.billedSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Discount</span>
                <span>- ৳ {invoice.discount.toLocaleString()}</span>
              </div>
              {invoice.couponDiscount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Coupon ({invoice.couponCode})</span>
                  <span>- ৳ {invoice.couponDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-600">
                <span>Delivery Charge</span>
                <span
                  className={
                    invoice.deliveryCharge === 0 ? "text-emerald-600" : ""
                  }
                >
                  {invoice.deliveryCharge === 0
                    ? "Free"
                    : `৳ ${invoice.deliveryCharge.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-2 text-sm font-black text-zinc-900">
                <span>Total</span>
                <span>৳ {invoice.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <p className="mt-6 border-t border-zinc-100 pt-3 text-[11px] italic text-zinc-500">
            Thank you for shopping with Loomora Lifestyle Ltd. — this is a
            computer generated invoice.
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-4 bg-white px-4 py-28 text-center">
        <h1 className="text-2xl font-extrabold text-zinc-900">
          Nothing to checkout
        </h1>
        <p className="text-sm text-zinc-500">
          Your cart is empty — add some items first.
        </p>
        <Link
          href="/new-in"
          className="mt-2 rounded-md bg-[#12509b] px-8 py-3 text-sm font-bold tracking-wide text-white transition-opacity hover:opacity-90"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f6f7f9] pb-16">
      <div className="grid gap-5 px-4 pt-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        {/* Left column */}
        <div className="min-w-0 space-y-6">
          {/* Shipping Address */}
          <form
            id="checkout-form"
            onChange={(e) => setFormValid(e.currentTarget.checkValidity())}
            onSubmit={handlePlaceOrder}
            className="space-y-6"
          >
            {/* Shipping Address */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-extrabold text-zinc-900">
              Shipping Address
            </h2>

            <div className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <label className={labelClass}>
                Recipient Name <span className="text-red-500">*</span>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className={fieldClass}
                />
              </label>
              <label className={labelClass}>
                Contact Number <span className="text-red-500">*</span>
                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="Mobile Number"
                  pattern="[0-9+\- ]{6,}"
                  className={fieldClass}
                />
              </label>

              <label className={labelClass}>
                Country
                <select name="country" defaultValue="Bangladesh" className={fieldClass}>
                  <option>Bangladesh</option>
                </select>
              </label>
              <label className={labelClass}>
                District/City <span className="text-red-500">*</span>
                <input
                  required
                  type="text"
                  name="city"
                  list="checkout-districts"
                  placeholder="Search or Select District/City Name"
                  value={deliveryCity}
                  onChange={(event) => setDeliveryCity(event.target.value)}
                  className={fieldClass}
                />
                <datalist id="checkout-districts">
                  {districts.map((district) => (
                    <option key={district} value={district} />
                  ))}
                </datalist>
              </label>

              <label className={labelClass}>
                Area/Thana/Upazila <span className="text-red-500">*</span>
                <input
                  required
                  type="text"
                  name="area"
                  list="checkout-areas"
                  placeholder="Search or Select Area/Thana/Upazilla"
                  className={fieldClass}
                />
                <datalist id="checkout-areas">
                  {areas.map((area) => (
                    <option key={area} value={area} />
                  ))}
                </datalist>
              </label>
              <label className={labelClass}>
                Post Code
                <input
                  type="text"
                  name="postcode"
                  inputMode="numeric"
                  placeholder="Post Code"
                  className={fieldClass}
                />
              </label>

              <label className={`sm:col-span-2 ${labelClass}`}>
                Address <span className="text-red-500">*</span>
                <textarea
                  required
                  name="address"
                  rows={3}
                  placeholder="House / Building / Street"
                  className={`${fieldClass} resize-y`}
                />
              </label>
            </div>

            <fieldset className="mt-5">
              <legend className="text-sm font-bold text-zinc-800">
                Select Effective Delivery <span className="text-red-500">*</span>
              </legend>
              <div className="mt-2.5 flex gap-6">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                  <input
                    type="radio"
                    name="delivery"
                    value="home"
                    defaultChecked
                    required
                    className="h-4 w-4 accent-[#12509b]"
                  />
                  Home
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                  <input
                    type="radio"
                    name="delivery"
                    value="office"
                    required
                    className="h-4 w-4 accent-[#12509b]"
                  />
                  Office
                </label>
              </div>
            </fieldset>

            {/* Hidden submit — enables Enter-to-submit */}
            <button
              type="submit"
              tabIndex={-1}
              aria-hidden
              className="sr-only"
            >
              Submit
            </button>
            </div>

            {/* Payment Method */}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-extrabold text-zinc-900">
              Payment Method
            </h2>

            <div className="mt-4 space-y-3">
              {paymentOptions.map((option) => {
                const Icon = option.icon;
                const active = payment === option.id;
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-3.5 rounded-lg border p-4 transition-all ${
                      active
                        ? "border-[#12509b] bg-[#12509b]/5"
                        : "border-zinc-200 hover:border-zinc-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.id}
                      checked={active}
                      onChange={() => {
                        setPayment(option.id);
                        // re-check after wallet fields mount/unmount
                        requestAnimationFrame(() => {
                          const form = document.getElementById(
                            "checkout-form"
                          ) as HTMLFormElement | null;
                          if (form) setFormValid(form.checkValidity());
                        });
                      }}
                      className="sr-only"
                    />
                    <span
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all ${
                        active
                          ? "bg-white border-2 border-[#12509b] shadow-xs"
                          : "bg-white border border-zinc-200 text-zinc-500"
                      }`}
                    >
                      {option.id === "bkash" ? (
                        <Image
                          src="/hero/bkash.png"
                          alt="bKash"
                          width={38}
                          height={20}
                          className="h-5 w-auto object-contain"
                        />
                      ) : option.id === "nagad" ? (
                        <Image
                          src="/hero/nagad.jpg"
                          alt="Nagad"
                          width={38}
                          height={20}
                          className="h-5 w-auto object-contain rounded-xs"
                        />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-zinc-900">
                        {option.label}
                      </span>
                      <span className="block text-xs text-zinc-500">
                        {option.note}
                      </span>
                    </span>
                    <span
                      className={`ml-auto h-4 w-4 shrink-0 rounded-full border-2 ${
                        active
                          ? "border-[#12509b] bg-[#12509b] shadow-[inset_0_0_0_2.5px_white]"
                          : "border-zinc-300"
                      }`}
                    />
                  </label>
                );
              })}
            </div>

            {payment !== "cod" && (
              <div className="mt-4 space-y-3 rounded-lg border border-dashed border-[#12509b]/40 bg-[#12509b]/5 p-4">
                <p className="text-sm leading-relaxed text-zinc-700">
                  Send <b>৳ {subtotal.toLocaleString()}</b> from your{" "}
                  <b>{paymentLabel}</b> wallet to{" "}
                  <b className="text-[#12509b]">01712-345678</b>, then enter
                  your number and Transaction ID below.
                </p>
                <div className="grid gap-x-4 gap-y-3 sm:grid-cols-2">
                  <label className={labelClass}>
                    {paymentLabel} Number{" "}
                    <span className="text-red-500">*</span>
                    <input
                      required
                      type="tel"
                      name="wallet"
                      placeholder="01XXXXXXXXX"
                      pattern="01[0-9]{9}"
                      className={fieldClass}
                    />
                  </label>
                  <label className={labelClass}>
                    Transaction ID (TrxID){" "}
                    <span className="text-red-500">*</span>
                    <input
                      required
                      type="text"
                      name="trxid"
                      placeholder="e.g. 9H8B7C6D5E"
                      minLength={6}
                      autoCapitalize="characters"
                      className={fieldClass}
                    />
                  </label>
                </div>
              </div>
            )}
            </div>
          </form>

          {/* Product Items */}
          <section>
            <h2 className="text-lg font-extrabold text-zinc-900">
              Product Items
            </h2>

            <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-zinc-200 px-4 py-3.5 sm:px-5">
                <Home className="h-4.5 w-4.5 text-zinc-600" />
                <span className="text-sm font-bold text-zinc-900">
                  Loomora Lifestyle
                </span>
                <ChevronRight className="h-4 w-4 text-zinc-400" />
              </div>

              <div className="divide-y divide-zinc-100">
                {items.map((item, index) => (
                  <div key={item.key} className="px-4 py-4 sm:px-5">
                    <p className="text-xs font-semibold text-zinc-500">
                      SN. {index + 1}
                    </p>

                    <div className="mt-2 flex flex-wrap items-start gap-4">
                      <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden rounded-md bg-zinc-50 sm:w-20">
                        <Image
                          src={item.src}
                          alt={item.name}
                          fill
                          sizes="5rem"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1 basis-40">
                        <p className="text-sm font-semibold leading-snug text-zinc-900">
                          {item.name}
                        </p>
                        <p className="mt-1.5 text-xs text-zinc-600">
                          Color : <b>{item.colorName ?? "Default"}</b>
                        </p>
                        <p className="text-xs text-zinc-600">
                          Size : <b>{item.size}</b>
                        </p>
                      </div>

                      <div className="basis-44 text-xs text-zinc-600">
                        <p>
                          Seller Product SKU :{" "}
                          <b className="text-zinc-800">
                            {item.id}-
                            {item.size.toLowerCase().replace(/\s+/g, "-")}
                          </b>
                        </p>
                        <p className="mt-1">
                          Unit Price :{" "}
                          <b className="text-zinc-800">
                            ৳ {item.price.toLocaleString()}
                          </b>{" "}
                          {item.oldPrice && item.oldPrice > item.price && (
                            <span className="text-red-500 line-through">
                              ৳ {item.oldPrice.toLocaleString()}
                            </span>
                          )}
                        </p>
                        <p className="mt-1 flex flex-wrap items-center gap-2">
                          Amount :{" "}
                          <b className="text-zinc-800">
                            ৳ {(item.price * item.qty).toLocaleString()}
                          </b>
                          {item.oldPrice && item.oldPrice > item.price && (
                            <span className="rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                              Save ৳{" "}
                              {(
                                (item.oldPrice - item.price) *
                                item.qty
                              ).toLocaleString()}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="ml-auto flex flex-col items-center gap-2">
                        <div className="flex items-center gap-1.5 rounded-full border border-[#12509b] px-2 py-1">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => setQty(item.key, item.qty - 1)}
                            disabled={item.qty <= 1}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-[#12509b] transition-colors hover:bg-[#12509b]/10 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-5 text-center text-sm font-bold">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => setQty(item.key, item.qty + 1)}
                            className="flex h-6 w-6 items-center justify-center rounded-full text-[#12509b] transition-colors hover:bg-[#12509b]/10"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => removeItem(item.key)}
                          className="text-red-500 transition-colors hover:text-red-600"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Policy Notes */}
          <section className="pb-4 text-[13px] leading-relaxed text-zinc-700">
            <p className="font-bold text-zinc-900">সম্মানিত গ্রাহক,</p>
            <ol className="mt-2 space-y-1.5">
              {policyNotes.map((note, index) => (
                <li key={note}>
                  {bnDigits(index + 1)}) {note}
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Your Bill */}
        <aside className="h-fit rounded-xl border border-zinc-200 bg-white p-5 shadow-sm xl:sticky xl:top-32">
          <h2 className="text-lg font-extrabold text-zinc-900">Your Bill</h2>

          {/* Coupon */}
          <div className="mt-4">
            {couponCode ? (
              <div className="flex items-center justify-between gap-2 rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2.5">
                <span className="flex min-w-0 items-center gap-2 text-sm font-semibold text-emerald-800">
                  <Tag className="h-4 w-4 shrink-0" />
                  <span className="truncate">{couponCode}</span>
                  {couponDiscount > 0 && (
                    <span className="shrink-0 text-emerald-600">
                      -৳{couponDiscount.toLocaleString()}
                    </span>
                  )}
                  {freeShipping && (
                    <span className="shrink-0 text-emerald-600">Free ship</span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={removeCoupon}
                  aria-label="Remove coupon"
                  className="shrink-0 text-emerald-700 transition-opacity hover:opacity-70"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code"
                  className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm uppercase text-zinc-800 outline-none transition-colors placeholder:normal-case placeholder:text-zinc-400 focus:border-[#12509b]"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponLoading || !couponInput.trim()}
                  className={`shrink-0 rounded-md px-4 text-sm font-bold transition-colors ${
                    couponLoading || !couponInput.trim()
                      ? "cursor-not-allowed bg-zinc-200 text-zinc-500"
                      : "bg-[#12509b] text-white hover:opacity-90"
                  }`}
                >
                  {couponLoading ? "..." : "Apply"}
                </button>
              </div>
            )}
            {couponMsg && (
              <p
                className={`mt-1.5 text-xs font-medium ${
                  couponErr ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {couponMsg}
              </p>
            )}
          </div>

          <div className="mt-4 space-y-3 text-sm text-zinc-700">
            <div className="flex justify-between">
              <span>Sub-Total</span>
              <span className="font-medium">
                ৳ {billedSubtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="font-medium text-red-600">
                - ৳ {discount.toFixed(2)}
              </span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between">
                <span>Coupon ({couponCode})</span>
                <span className="font-medium text-red-600">
                  - ৳ {couponDiscount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span
                className={`font-medium ${
                  deliveryCharge === 0 ? "text-emerald-600" : "text-zinc-900"
                }`}
              >
                {deliveryCharge === 0
                  ? "Free"
                  : `৳ ${deliveryCharge.toFixed(2)}`}
              </span>
            </div>
            <p className="text-[11px] leading-snug text-zinc-400">
              {deliveryHint}
            </p>
          </div>

          <hr className="my-4 border-zinc-200" />

          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold text-zinc-900">Total</span>
            <span className="text-xl font-black text-zinc-900">
              ৳ {grandTotal.toFixed(2)}
            </span>
          </div>

          {orderErr && (
            <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
              {orderErr}
            </p>
          )}

          <button
            type="submit"
            form="checkout-form"
            disabled={!formValid || placing}
            className={`mt-5 w-full rounded-md py-3.5 text-sm font-bold tracking-wide transition-colors ${
              formValid && !placing
                ? "bg-[#12509b] text-white hover:opacity-90"
                : "cursor-not-allowed bg-zinc-200 text-zinc-500"
            }`}
          >
            {placing ? "Placing Order..." : "Continue to Shipping"}
          </button>

          <p className="mt-3 text-center text-xs text-zinc-500">
            {count} {count === 1 ? "item" : "items"} in this order
          </p>
        </aside>
      </div>
    </div>
  );
}
