import AppHeader from "@/components/AppHeader";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { LocaleProvider } from "@/components/LocaleProvider";
import SeoJsonLd from "@/components/SeoJsonLd";
import { buildRootMetadata } from "@/lib/i18n/metadata";
import { getServerLocale } from "@/lib/i18n/server";
import type { Metadata, Viewport } from "next";
import { Geist, Pacifico } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return buildRootMetadata(locale);
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const locale = await getServerLocale();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${pacifico.variable} h-full overflow-x-clip antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-clip font-sans">
        <SeoJsonLd locale={locale} />
        <LocaleProvider initialLocale={locale}>
          <GoogleAnalytics />
          <AppHeader />
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
