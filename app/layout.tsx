import AppHeader from "@/components/AppHeader";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://auramaker.net";

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

const ogImage = {
  url: `${siteUrl}/brand/og.png`,
  width: 1200,
  height: 630,
  alt: "AuraMaker | 友達から見た自分のオーラがわかる",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AuraMaker | 友達から見た自分のオーラがわかる",
    template: "%s | AuraMaker",
  },
  description:
    "周りからどう思われてるか、知りたくない？友達の印象からオーラ診断。AuraMaker",
  openGraph: {
    title: "AuraMaker | 友達から見た自分のオーラがわかる",
    description:
      "周りからどう思われてるか、知りたくない？友達の印象からオーラ診断。AuraMaker",
    siteName: "AuraMaker",
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraMaker | 友達から見た自分のオーラがわかる",
    description:
      "周りからどう思われてるか、知りたくない？友達の印象からオーラ診断。AuraMaker",
    images: [ogImage.url],
  },
  icons: {
    icon: [
      { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/brand/favicon-192.png", sizes: "192x192", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  ...(googleSiteVerification
    ? {
        verification: {
          google: googleSiteVerification,
        },
      }
    : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} h-full overflow-x-clip antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip">
        <GoogleAnalytics />
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
