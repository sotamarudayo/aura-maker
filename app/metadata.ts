import type { Metadata } from "next";
import { SERVICE_SHARE_TEXT } from "@/lib/constants/share";

export const metadata: Metadata = {
  title: "AuraMaker | 友達から見た自分のオーラがわかる",
  description: SERVICE_SHARE_TEXT,
  openGraph: {
    title: "AuraMaker | 友達から見た自分のオーラがわかる",
    description: SERVICE_SHARE_TEXT,
    type: "website",
    images: [
      {
        url: "/brand/og.png",
        width: 1200,
        height: 630,
        alt: "AuraMaker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraMaker | 友達から見た自分のオーラがわかる",
    description: SERVICE_SHARE_TEXT,
    images: ["/brand/og.png"],
  },
};
