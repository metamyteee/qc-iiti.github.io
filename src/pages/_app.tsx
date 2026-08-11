import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/_Global.scss';
import '../styles/Header.scss'; 
import '../styles/HeroSection.scss';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Quantum Computing Club | IIT Indore</title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
