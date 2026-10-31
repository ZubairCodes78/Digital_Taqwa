import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { AmbientQuranAudio } from "@/components/AmbientQuranAudio";
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
  themeColor: "#F6F4ED",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://digitaltaqwa.com"),
  title: "Digital Taqwa — Make Space for What Truly Matters",
  description:
    "Build better habits, strengthen your Deen, and create a more intentional digital life. Join the early access waitlist.",
  keywords: [
    "Digital Taqwa",
    "Islamic digital wellness",
    "Islamic habit companion",
    "Prayer consistency",
    "Quran tracker",
    "Screen time control",
    "Mindful Deen habits",
  ],
  authors: [{ name: "Digital Taqwa" }],
  creator: "Digital Taqwa",
  publisher: "Digital Taqwa",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://digitaltaqwa.com",
    siteName: "Digital Taqwa",
    title: "Digital Taqwa — Make Space for What Truly Matters",
    description:
      "Build better habits, strengthen your Deen, and create a more intentional digital life.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Digital Taqwa — Make Space for What Truly Matters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Taqwa — Make Space for What Truly Matters",
    description:
      "Build better habits, strengthen your Deen, and create a more intentional digital life.",
    images: ["/og-image.jpg"],
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang="en" className={`${plusJakarta.variable} ${outfit.variable}`}>
      <head>
        {/* Instant Audio Preconnect to maximize initial Quran recitation speed */}
        <link rel="preconnect" href="https://cdn.mp3quran.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://server11.mp3quran.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.mp3quran.net" />
        <link rel="dns-prefetch" href="https://server11.mp3quran.net" />

        {/* Google Analytics 4 */}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

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
        {children}
        <AmbientQuranAudio />
      </body>
    </html>
  );
}
