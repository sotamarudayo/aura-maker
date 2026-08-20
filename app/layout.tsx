import AppHeader from "@/components/AppHeader";
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

export const metadata: Metadata = {
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
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraMaker | 友達から見た自分のオーラがわかる",
    description:
      "友達から見た自分の『オーラ』がわかる！ AuraMakerでみんなの印象を集めよう✨",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full overflow-x-clip antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip">
        <AppHeader />
        {children}
      </body>
    </html>
  );
}
