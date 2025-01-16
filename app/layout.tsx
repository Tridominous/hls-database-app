import React from 'react'

import {
  ClerkProvider,
} from '@clerk/nextjs'
import './globals.css'

import { Inter, Space_Grotesk } from 'next/font/google';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Toaster } from "@/components/ui/toaster"

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from './api/uploadthing/core';



const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter'
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-spaceGrotesk'
})

export const metadata: Metadata = {
  title: "HLS Database",
  description: "A database containing curated equipment for the Health and Life Science Faculty",
  icons: {
    icon: [
      { url: '/public/favicon.ico', sizes: "any" },
      { url: '/public/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/public/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/public/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
    
        <html lang="en">
          <head>
            {/* Next.js will automatically add the metadata tags */}
            <title>DMU | HLS Database</title>
            <meta name="title" content="DMU | HLS Database" />
            <meta name="description" content="A database containing curated equipment for the Health and Life Science Faculty" />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://metatags.io/" />
            <meta property="og:title" content="DMU | HLS Database" />
            <meta property="og:description" content="A database containing curated equipment for the Health and Life Science Faculty" />
            <meta property="og:image" content="https://metatags.io/images/meta-tags.png" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content="https://metatags.io/" />
            <meta property="twitter:title" content="DMU | HLS Database" />
            <meta property="twitter:description" content="A database containing curated equipment for the Health and Life Science Faculty" />
            <meta property="twitter:image" content="https://metatags.io/images/meta-tags.png" />
          </head>
          <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
          <ClerkProvider
            appearance={{
            elements: {
            formButtonPrimary: 'primary-gradient',
            footerActionLink: 'primary-text-gradient hover:text-primary-500'
              }
            }}
          > 
              <ThemeProvider>
                <NextSSRPlugin
                  /**
                   * The `extractRouterConfig` will extract **only** the route configs
                   * from the router to prevent additional information from being
                   * leaked to the client. The data passed to the client is the same
                   * as if you were to fetch `/api/uploadthing` directly.
                   */
                  routerConfig={extractRouterConfig(ourFileRouter)}
                />
                <Toaster />
                {children}
              </ThemeProvider>
      </ClerkProvider>
          </body>
        </html>
    
  )
}
