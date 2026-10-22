import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VCEP | Commerce WorkLab",
  description: "The 24-session Vayentra commerce learning and assessment workspace.",
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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
