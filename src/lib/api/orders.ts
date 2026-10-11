import { apiFetch } from "./client";

export type OrderItemPayload = {
  id: number;
  variant_id?: number;
  qty: number;
};

export type PlaceOrderParams = {
  name: string;
  phone: string;
  email?: string;
  address: string;
  area?: string;
  city: string;
  postcode?: string;
  payment: string;
  wallet?: string;
  trxid?: string;
  delivery_charge: number;
  coupon_code?: string;
  notes?: string;
  items: OrderItemPayload[];
};

export type PlacedOrder = {
  orderId: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
};

type OrderSuccessResponse = {
  success: boolean;
  message: string;
  data: {
    order_id: number;
    order_number: string;
    status: string;
    payment_status: string;
    payment_method: string;
    subtotal: number;
    discount: number;
    shipping_cost: number;
    total: number;
  };
};

export async function placeOrder(
  params: PlaceOrderParams
): Promise<PlacedOrder> {
  const res = await apiFetch<OrderSuccessResponse>("/orders", {
    method: "POST",
    body: params,
  });
  return {
    orderId: res.data.order_id,
    orderNumber: res.data.order_number,
    status: res.data.status,
    paymentStatus: res.data.payment_status,
    paymentMethod: res.data.payment_method,
    subtotal: res.data.subtotal,
    discount: res.data.discount,
    shippingCost: res.data.shipping_cost,
    total: res.data.total,
  };
}
