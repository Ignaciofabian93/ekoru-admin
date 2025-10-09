import type { Metadata } from "next";
import { Cabin } from "next/font/google";
import { ToastContainer } from "react-toastify";
import Script from "next/script";
import AppWrapper from "./appWrapper";
import "./globals.css";

const cabin = Cabin({
  variable: "--font-cabin",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EKORU",
  description: "Panel de administración",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ffffff" />
        <Script src="//unpkg.com/react-scan/dist/auto.global.js" strategy="afterInteractive" crossOrigin="anonymous" />
      </head>
      <body className={`${cabin.variable} antialiased`}>
        <ToastContainer theme="light" autoClose={2500} pauseOnHover position="top-center" closeOnClick />
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
