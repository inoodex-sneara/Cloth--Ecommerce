import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ChatWidget from "@/components/ChatWidget";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";
import { API_BASE_URL } from "@/lib/api/client";
import { getSettings } from "@/lib/api/settings";
import { CartProvider } from "@/providers/CartProvider";
import { GsapProvider } from "@/providers/GsapProvider";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import { WishlistProvider } from "@/providers/WishlistProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `${settings.store_name} — ${settings.store_tagline}`;
  const description = `${settings.store_name} Lifestyle — shop clothing, accessories and more.`;

  return {
    title,
    description,
    icons: settings.store_favicon
      ? { icon: `${API_BASE_URL.replace("/api/v1", "")}${settings.store_favicon}` }
      : undefined,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <SmoothScrollProvider>
          <GsapProvider>
            <CartProvider>
              <WishlistProvider>
                <ScrollToTop />
                <Navbar settings={settings} />
                {children}
                <Footer settings={settings} />
                <ChatWidget />
              </WishlistProvider>
            </CartProvider>
          </GsapProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
