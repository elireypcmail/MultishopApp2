import type { AppProps } from "next/app";
import '@s/_index.scss'
import '@s/globals.css'
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Multishop KPI</title>
        <link rel="manifest" href="manifest.json" />
        <link rel="icon" href="/icon512_maskable.png" />
        <link rel="apple-touch-icon" href="/icon512_rounded.png" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
