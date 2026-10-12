import { apiFetch } from "./client";

export type AuthUser = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

type RegisterResponse = {
  success: boolean;
  message: string;
  token: string;
  data: {
    user_id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
  };
};

type LoginResponse = {
  success: boolean;
  message: string;
  token: string;
  data: {
    user_id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
  };
};

const TOKEN_KEY = "loomora-auth-token";
const USER_KEY = "loomora-auth-user";

export const AUTH_EVENT = "loomora-auth-changed";

function emitAuthChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function saveSession(session: AuthSession) {
  try {
    window.localStorage.setItem(TOKEN_KEY, session.token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  } catch {
    // storage unavailable — session stays in memory only
  }
  emitAuthChange();
}

export function loadToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function loadUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
  emitAuthChange();
}

export async function register(params: {
  name: string;
  phone?: string;
  email: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthSession> {
  const res = await apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: params,
  });
  return {
    token: res.token,
    user: {
      id: res.data.user_id,
      name: res.data.name,
      email: res.data.email ?? null,
      phone: res.data.phone ?? null,
    },
  };
}

export async function login(params: {
  identifier: string;
  password: string;
}): Promise<AuthSession> {
  const res = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: params,
  });
  return {
    token: res.token,
    user: {
      id: res.data.user_id,
      name: res.data.name,
      email: res.data.email ?? null,
      phone: res.data.phone ?? null,
    },
  };
}

export type MeProfile = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  customer: {
    id: number | null;
    firstName: string;
    lastName: string;
    phone: string | null;
    email: string | null;
    city: string | null;
    address: string | null;
    ordersCount: number;
    totalSpent: number;
  };
};

type MeResponse = {
  success: boolean;
  data: {
    id: number;
    user_id?: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    address_line_1?: string | null;
    city?: string | null;
    total_orders?: number;
    total_spent?: number;
    customer?: {
      id?: number | null;
      first_name?: string | null;
      last_name?: string | null;
      phone?: string | null;
      email?: string | null;
      city?: string | null;
      address_line_1?: string | null;
      orders_count?: number;
      total_spent?: number;
    } | null;
  };
};

export async function getMe(): Promise<MeProfile> {
  const token = loadToken();
  if (!token) throw new Error("Not signed in");
  const res = await apiFetch<MeResponse>("/auth/me", {
    token,
    cache: "no-store",
  });
  const d = res.data;
  const c = d.customer;
  return {
    id: d.id,
    name: d.name,
    email: d.email ?? null,
    phone: d.phone ?? null,
    customer: {
      id: c?.id ?? null,
      firstName: c?.first_name ?? "",
      lastName: c?.last_name ?? "",
      phone: c?.phone ?? d.phone ?? null,
      email: c?.email ?? d.email ?? null,
      city: c?.city ?? d.city ?? null,
      address: c?.address_line_1 ?? d.address_line_1 ?? null,
      ordersCount: c?.orders_count ?? d.total_orders ?? 0,
      totalSpent: c?.total_spent ?? d.total_spent ?? 0,
    },
  };
}

export async function logout(): Promise<void> {
  const token = loadToken();
  clearSession();
  if (!token) return;
  try {
    await apiFetch("/auth/logout", { method: "POST", token });
  } catch {
    // token already cleared locally — ignore network errors
  }
}

export type MyOrderItem = {
  id: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  total: number;
};

export type MyOrder = {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  itemsCount: number;
  createdAt: string | null;
  items: MyOrderItem[];
};

type MyOrdersResponse = {
  success: boolean;
  data: {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    payment_method: string;
    total: number;
    items_count?: number;
    created_at?: string | null;
    items?: {
      id: number;
      product_name: string;
      unit_price: number;
      quantity: number;
      total: number;
    }[];
  }[];
  meta?: {
    current_page?: number;
    last_page?: number;
    total?: number;
  };
};

export async function getMyOrders(page = 1): Promise<{
  orders: MyOrder[];
  page: number;
  lastPage: number;
  total: number;
}> {
  const token = loadToken();
  if (!token) throw new Error("Not signed in");
  const query = page > 1 ? `?page=${page}` : "";
  const res = await apiFetch<MyOrdersResponse>(`/auth/orders${query}`, {
    token,
    cache: "no-store",
  });
  return {
    orders: (res.data ?? []).map((o) => ({
      id: o.id,
      orderNumber: o.order_number,
      status: o.status,
      paymentStatus: o.payment_status,
      paymentMethod: o.payment_method,
      total: o.total,
      itemsCount: o.items_count ?? o.items?.length ?? 0,
      createdAt: o.created_at ?? null,
      items: (o.items ?? []).map((i) => ({
        id: i.id,
        productName: i.product_name,
        unitPrice: i.unit_price,
        quantity: i.quantity,
        total: i.total,
      })),
    })),
    page: res.meta?.current_page ?? page,
    lastPage: res.meta?.last_page ?? 1,
    total: res.meta?.total ?? res.data?.length ?? 0,
  };
}
