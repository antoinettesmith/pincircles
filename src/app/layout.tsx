import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PinCircles - Interest-based Image Sharing",
  description: "Join Circles, share Pins, and discover trending content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-16">{children}</main>
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  );
}
