"use client";

import { AUTH_EVENT, loadToken } from "@/lib/api/auth";
import {
  getWishlistIds,
  syncWishlist,
  toggleWishlistItem,
} from "@/lib/api/wishlist";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type WishlistContextValue = {
  ids: string[];
  count: number;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
};

const STORAGE_KEY = "loomora-wishlist";
const EMPTY: string[] = [];

let state: string[] = EMPTY;
let storageLoaded = false;
let syncing = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function loadFromStorage() {
  if (storageLoaded) return;
  storageLoaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      state = parsed.filter((entry): entry is string => typeof entry === "string");
      emit();
    }
  } catch {
    // corrupted storage — start empty
  }
}

function persist(next: string[]) {
  state = [...new Set(next)];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage blocked/full — wishlist still works in memory
  }
  emit();
}

function subscribe(listener: () => void) {
  loadFromStorage();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Load cloud wishlist and merge with local guest ids; push local-only ids up. */
async function pullAndMerge() {
  if (!loadToken() || syncing) return;
  syncing = true;
  try {
    const cloud = await getWishlistIds();
    const local = state;
    const merged = [...new Set([...local, ...cloud])];
    persist(merged);
    const localOnly = local.filter((id) => !cloud.includes(id));
    if (localOnly.length > 0) {
      const all = await syncWishlist(merged);
      persist(all.length > 0 ? all : merged);
    }
  } catch {
    // offline / API error — keep current state
  } finally {
    syncing = false;
  }
}

function toggle(id: string) {
  const removing = state.includes(id);
  persist(
    removing ? state.filter((entry) => entry !== id) : [...state, id]
  );
  if (!loadToken()) return;
  toggleWishlistItem(id)
    .then((result) => {
      if (!result) return;
      // Prefer authoritative full list; fall back to in_wishlist reconcile
      if (result.ids) {
        persist(result.ids);
        return;
      }
      persist(
        result.inWishlist
          ? [...state.filter((entry) => entry !== id), id]
          : state.filter((entry) => entry !== id)
      );
    })
    .catch(() => {
      // API failed — optimistic local state stands
    });
}

function remove(id: string) {
  persist(state.filter((entry) => entry !== id));
  if (!loadToken()) return;
  toggleWishlistItem(id)
    .then((result) => {
      if (result?.ids) persist(result.ids);
    })
    .catch(() => {
      // already removed locally
    });
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const ids = useSyncExternalStore(subscribe, () => state, () => EMPTY);

  useEffect(() => {
    void pullAndMerge();
    const onAuthChange = () => {
      void pullAndMerge();
    };
    window.addEventListener(AUTH_EVENT, onAuthChange);
    return () => window.removeEventListener(AUTH_EVENT, onAuthChange);
  }, []);

  const value = useMemo<WishlistContextValue>(
    () => ({
      ids,
      count: ids.length,
      has: (id: string) => ids.includes(id),
      toggle,
      remove,
    }),
    [ids]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return ctx;
}
