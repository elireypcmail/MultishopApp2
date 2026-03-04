import type { AppProps } from "next/app";
import { useState } from "react";
import '@s/_index.scss'
import '@s/globals.css'
import Head from "next/head";
import { SessionProvider } from "@g/SessionContext";
import RouteGuard from "@g/RouteGuard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sileo";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <Head>
        <title>Multishop KPI</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon512_maskable.png" />
        <link rel="apple-touch-icon" href="/icon512_rounded.png" />
        <meta name="theme-color" content="#f5f5f5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Multishop KPI" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <RouteGuard>
            <Component {...pageProps} />
          </RouteGuard>
          <Toaster position="top-right" />
        </SessionProvider>
      </QueryClientProvider>
    </>
  )
}