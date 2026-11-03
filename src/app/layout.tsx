import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { AmbientQuranAudio } from "@/components/AmbientQuranAudio";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { JsonLd } from "@/components/JsonLd";
import { GA_MEASUREMENT_ID, SOCIAL_PROFILES } from "@/lib/constants";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0A1410",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://digitaltaqwa.site"),
  title: {
    default: "Digital Taqwa — Reconnect With Allah. One Day at a Time.",
    template: "%s | Digital Taqwa",
  },
  description:
    "An early-stage Islamic digital sanctuary exploring how mindful technology, prayer consistency, Quran reading, and Sunnah habits can bring tranquility to your Deen. A project by Barakah Habits Daily.",
  keywords: [
    "Digital Taqwa",
    "Islamic digital wellness",
    "Islamic habit building",
    "Barakah Habits Daily",
    "Prayer consistency",
    "Mindful Quran recitation",
    "Islamic habit tracker",
    "Deen consistency",
    "Reduce phone distractions Islam",
    "Sunnah habits",
    "Khushu in Salah",
  ],
  authors: [
    { name: "Digital Taqwa", url: "https://digitaltaqwa.site" },
    { name: "Barakah Habits Daily", url: SOCIAL_PROFILES.youtube.url },
  ],
  creator: "Barakah Habits Daily",
  publisher: "Digital Taqwa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://digitaltaqwa.site",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      }
    : undefined,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://digitaltaqwa.site",
    siteName: "Digital Taqwa",
    title: "Digital Taqwa — Reconnect With Allah. One Day at a Time.",
    description:
      "An early-stage initiative exploring how digital experiences can support Islamic habits, intentional living and a more mindful relationship with technology.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Digital Taqwa — Make Space for What Truly Matters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Taqwa — Reconnect With Allah. One Day at a Time.",
    description:
      "An early-stage initiative exploring how digital experiences can support Islamic habits, intentional living and a more mindful relationship with technology.",
    images: ["/logo.png"],
    creator: "@barakahhabitsdaily",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = GA_MEASUREMENT_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang="en" className={`${plusJakarta.variable} ${outfit.variable}`}>
      <head>
        {/* Instant Audio Preconnect to maximize initial Quran recitation speed */}
        <link rel="preconnect" href="https://cdn.mp3quran.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://server11.mp3quran.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.mp3quran.net" />
        <link rel="dns-prefetch" href="https://server11.mp3quran.net" />

        {/* Structured Data (JSON-LD) for SEO, AEO & GEO */}
        <JsonLd />

        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}');
          `}
        </Script>

        {/* Meta Pixel */}
        {metaPixelId && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body className="bg-ivory text-charcoal font-sans antialiased selection:bg-forest selection:text-ivory min-h-screen">
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        {children}
        <AmbientQuranAudio />
      </body>
    </html>
  );
}
