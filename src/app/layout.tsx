import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cookies } from "next/headers";
import FarcasterWrapper from "@/components/FarcasterWrapper";
import { Providers } from "@/providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Farcaster Minting Dapp",
  description: "Launch your NFT collection",
  other: { "fc:frame": JSON.stringify({"version":"next","imageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/thumbnail_435ad18f-0094-47ab-8a7a-881688673066-0ANtobR3Md4YKZEBdCwjb5So8cvvFu","button":{"title":"Open App","action":{"type":"launch_frame","name":"Farcaster Minting DApp","url":"https://farcaster-minting-dapp.vercel.app","splashImageUrl":"https://usdozf7pplhxfvrl.public.blob.vercel-storage.com/farcaster/splash_images/splash_image1.svg","splashBackgroundColor":"#ffffff"}}}) }
};

// Root layout component - handles cookies and wraps app with providers
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get request ID from cookies for tracking
  const cookieStore = await cookies();
  const requestId = cookieStore.get("x-request-id")?.value;

  return (
    <html lang="en">
      <head>
        {requestId && <meta name="x-request-id" content={requestId} />}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <FarcasterWrapper>
            {children}
          </FarcasterWrapper>
        </Providers>
      </body>
    </html>
  );
}
