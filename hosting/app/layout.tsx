import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Band Life",
  description: "Deux maisons, deux groupes, un concert coopératif.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CA">
      <body className="antialiased">{children}</body>
    </html>
  );
}
