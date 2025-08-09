import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/auth/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { businessConfig } from "@/config/business";
import ConditionalLayout from "@/components/layout/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

// Generate metadata from business configuration

export const metadata: Metadata = {
  title: businessConfig.name,
  description: businessConfig.description,
  keywords: "small business, professional services, local business",
  authors: [{ name: businessConfig.name }],
  creator: businessConfig.name,
  metadataBase: new URL('https://yourdomain.com'),
  openGraph: {
    type: 'website',
    siteName: businessConfig.name,
    title: businessConfig.name,
    description: businessConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: businessConfig.name,
    description: businessConfig.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <AuthProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </AuthProvider>
          <Toaster 
            position="bottom-right"
            expand={false}
            richColors
            closeButton
          />
        </ErrorBoundary>
      </body>
    </html>
  );
}
