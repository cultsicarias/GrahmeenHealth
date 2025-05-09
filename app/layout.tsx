import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import 'leaflet/dist/leaflet.css';

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "GrahmeenHealth - Smart Care Assistant",
  description: "A modern healthcare platform for doctors and patients",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" className={playfair.variable}>
      <body className="font-playfair">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
