import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../styles/hero-animations.css";
import { UserProvider } from '../hooks/useUser';
import PlausibleProvider from 'next-plausible'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Soluna | AI角色观察",
  description: "当AI拥有情感，人类将找到真正的共生伙伴",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || 'localhost';
  const enabled = process.env.NEXT_PUBLIC_PLAUSIBLE_ENABLED === 'true';

  return (
    <html lang="zh-CN">
      <head>
        <link 
          href="https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css" 
          rel="stylesheet" 
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PlausibleProvider 
          domain={domain}
          enabled={enabled}
          trackOutboundLinks
          trackFileDownloads
        >
          <UserProvider>
            {children}
          </UserProvider>
        </PlausibleProvider>
      </body>
    </html>
  );
}
