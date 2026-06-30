import type { Metadata } from "next";
import "./globals.css";
import MobileAppLayout from "@/components/layout/MobileAppLayout";

export const metadata: Metadata = {
  title: "SalamatPo",
  description: "Medicine access route recommendation service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MobileAppLayout>{children}</MobileAppLayout>
      </body>
    </html>
  );
}