import type { Metadata } from "next";
import "./globals.css";
import CursorSpotlight from "@/components/CursorSpotlight";

export const metadata: Metadata = {
  title: "Pariwesh - AI Engineer",
  description: "Portfolio of Pariwesh, AI Engineer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CursorSpotlight />
        {children}
      </body>
    </html>
  );
}
