import { apiFetch } from "./client";

export type CouponItem = {
  product_id: number;
  quantity: number;
  price: number;
};

export type CouponValidation = {
  valid: boolean;
  message: string;
  couponId?: number;
  code?: string;
  type?: string;
  discountAmount?: number;
  freeShipping?: boolean;
  newSubtotal?: number;
};

type CouponSuccessResponse = {
  success: boolean;
  message: string;
  data?: {
    coupon_id: number;
    code: string;
    type: string;
    discount_amount: number;
    free_shipping: boolean;
    new_subtotal: number;
  };
};

export async function validateCoupon(params: {
  code: string;
  subtotal: number;
  customer_phone?: string;
  items?: CouponItem[];
}): Promise<CouponValidation> {
  try {
    const res = await apiFetch<CouponSuccessResponse>("/coupons/validate", {
      method: "POST",
      body: params,
    });
    return {
      valid: true,
      message: res.message,
      couponId: res.data?.coupon_id,
      code: res.data?.code,
      type: res.data?.type,
      discountAmount: res.data?.discount_amount ?? 0,
      freeShipping: res.data?.free_shipping ?? false,
      newSubtotal: res.data?.new_subtotal,
    };
  } catch (err) {
    const message =
      err instanceof Error && err.message
        ? err.message
        : "Coupon apply korte parina";
    return { valid: false, message };
  }
}
