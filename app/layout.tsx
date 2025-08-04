import type { Metadata } from "next";
import { Cabin } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import AppWrapper from "./wrapper";

const cabin = Cabin({
  variable: "--font-cabin-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EKORU",
  description: "Panel de administración de EKORU",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cabin.variable} antialiased`}>
        <ToastContainer
          theme="light"
          autoClose={2500}
          pauseOnHover
          position="top-center"
          closeOnClick
        />
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
