import { apiFetch } from "./client";

export type TrackedOrderItem = {
  productName: string;
  sku: string | null;
  image: string | null;
  unitPrice: number;
  quantity: number;
  total: number;
};

export type TrackedOrder = {
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  courierProvider: string | null;
  courierTrackingCode: string | null;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  createdAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  customer: {
    name: string;
    phone: string;
    address: string;
    city: string;
    area: string;
  };
  items: TrackedOrderItem[];
};

type TrackResponse = {
  success: boolean;
  data: {
    order_number: string;
    status: string;
    payment_status: string;
    payment_method: string;
    courier_provider: string | null;
    courier_tracking_code: string | null;
    subtotal: number;
    discount: number;
    shipping_cost: number;
    total: number;
    created_at: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
    shipping_address: {
      name?: string | null;
      first_name?: string | null;
      last_name?: string | null;
      phone?: string | null;
      address_line_1?: string | null;
      city?: string | null;
      area?: string | null;
    } | null;
    items: {
      product_name: string;
      sku: string | null;
      image: string | null;
      unit_price: number;
      quantity: number;
      total: number;
    }[];
  };
};

export async function trackOrder(
  orderNumber: string,
  phone?: string
): Promise<TrackedOrder> {
  const query = phone ? `?phone=${encodeURIComponent(phone)}` : "";
  const res = await apiFetch<TrackResponse>(
    `/orders/track/${encodeURIComponent(orderNumber.trim())}${query}`,
    { cache: "no-store" }
  );
  const d = res.data;
  const addr = d.shipping_address;
  return {
    orderNumber: d.order_number,
    status: d.status,
    paymentStatus: d.payment_status,
    paymentMethod: d.payment_method,
    courierProvider: d.courier_provider,
    courierTrackingCode: d.courier_tracking_code,
    subtotal: d.subtotal,
    discount: d.discount,
    shippingCost: d.shipping_cost,
    total: d.total,
    createdAt: d.created_at,
    shippedAt: d.shipped_at,
    deliveredAt: d.delivered_at,
    customer: {
      name:
        addr?.name ||
        [addr?.first_name, addr?.last_name].filter(Boolean).join(" "),
      phone: addr?.phone ?? "",
      address: addr?.address_line_1 ?? "",
      city: addr?.city ?? "",
      area: addr?.area ?? "",
    },
    items: (d.items ?? []).map((item) => ({
      productName: item.product_name,
      sku: item.sku,
      image: item.image,
      unitPrice: item.unit_price,
      quantity: item.quantity,
      total: item.total,
    })),
  };
}
