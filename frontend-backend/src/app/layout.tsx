import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionWrapper from "@/components/SessionWrapper";  // Import SessionWrapper


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NICE",
  description: "Neurological Imaging Classification & Evaluation",
  keywords: ["NICE", "Neurological Imaging Classification & Evaluation", "next.js"],
  authors: [{name: "John Langs"}, {name: "Andrew Lin"}, {name: "Eric McGonagle"}, {name: "Daniel Querrey"}, {name: "Nai Yun Wu"}],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>  
          <Navbar />
          <div className="bg-[#F4F0E9]">
            {children}
          </div>
        </SessionWrapper>

      </body>
    </html>
  );
}
