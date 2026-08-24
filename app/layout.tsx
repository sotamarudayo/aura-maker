import AppHeader from "@/components/AppHeader";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://aura.booklovers-haven.com";

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

const ogImage = {
  url: `${siteUrl}/api/og`,
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
    "友達から見た自分の『オーラ』がわかる！ AuraMakerでみんなの印象を集めよう✨",
  openGraph: {
    title: "AuraMaker | 友達から見た自分のオーラがわかる",
    description:
      "友達から見た自分の『オーラ』がわかる！ AuraMakerでみんなの印象を集めよう✨",
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
      "友達から見た自分の『オーラ』がわかる！ AuraMakerでみんなの印象を集めよう✨",
    images: [ogImage.url],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full overflow-x-clip antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip">
        <GoogleAnalytics />
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
