import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Adventa — Weekend Escapes in Maharashtra",
  description: "Discover, compare, and book weekend adventures across Maharashtra. Trekking, camping, forts, waterfalls.",

};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body className={inter.className + " antialiased"}>
          <div className="pb-16 md:pb-0">{children}</div>
          <MobileBottomNav />
        </body>
      </html>
    </ViewTransitions>
  );
}
