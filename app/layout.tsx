import type { Metadata } from "next";
import "./globals.css";
import { product } from "@/lib/product";

export const metadata: Metadata = {
  title: `${product.brandName} | ${product.name}`,
  description: product.description,
  icons: {
    icon: [
      {
        url: "/favicon.trimmed.png",
        sizes: "512x512",
        type: "image/png"
      }
    ],
    shortcut: "/favicon.trimmed.png",
    apple: [
      {
        url: "/favicon.trimmed.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
