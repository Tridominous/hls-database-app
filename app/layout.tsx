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
    icon: "/favicon.ico",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    
    
        <html lang="en">
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
