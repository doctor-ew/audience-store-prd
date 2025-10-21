import Home from "@/components/Home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Atlanta FIFA Navigator",
  description: "Navigate Atlanta's traffic and transit during FIFA events.",
  openGraph: {
    title: "Atlanta FIFA Navigator",
    description: "Real-time traffic and transit for Mercedes-Benz Stadium.",
    url: "https://your-production-url.com", // Replace with your production URL
    siteName: "Atlanta FIFA Navigator",
    images: [
      {
        url: "https://your-production-url.com/og-image.png", // Replace with your OG image URL
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <Home />;
}
