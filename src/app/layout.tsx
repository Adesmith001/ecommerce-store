import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProfileSync } from "@/components/auth/auth-profile-sync";
import { AppProviders } from "@/components/providers/app-providers";
import { APP_DESCRIPTION, APP_NAME } from "@/constants/app";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <AuthProfileSync />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
