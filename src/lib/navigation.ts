export type NavLink = {
  href: string;
  label: string;
  /** Always styled blue + underlined (sale/campaign links) */
  highlight?: boolean;
};

export const navLinks: NavLink[] = [
  { href: "/", label: "HOME" },
  { href: "/festival-26", label: "Loomora Fest70", highlight: true },
  { href: "/puja-2026", label: "PUJA-2026" },

  { href: "/budget-picks", label: "Budget Picks" },
  { href: "/best-deals", label: "Best Deals", highlight: true },
  { href: "/men", label: "Mens" },
  { href: "/women", label: "Womens" },
  { href: "/kids", label: "Kids" },
];

const categoryLinks: NavLink[] = [
  { href: "/men", label: "Mens" },
  { href: "/women", label: "Womens" },
  { href: "/kids", label: "Kids" },
];

export function buildNavLinks(
  apiMenu?: { label: string; href: string; highlight?: boolean }[] | null,
): NavLink[] {
  if (!apiMenu?.length) return navLinks;

  const fromApi: NavLink[] = apiMenu.map((item) => ({
    href: item.href,
    label: item.label,
    highlight: item.highlight,
  }));

  const apiHrefs = new Set(fromApi.map((l) => l.href));
  const extras = categoryLinks.filter((l) => !apiHrefs.has(l.href));

  return [...fromApi, ...extras];
}
