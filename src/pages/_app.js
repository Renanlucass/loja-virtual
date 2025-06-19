import "@/styles/globals.css";
import Layout from '../components/Layout';
import { CartProvider } from "@/context/CartContext";
import Head from 'next/head';
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <CartProvider>
      <Head>
        <link rel="icon" href="/logo-maria.png" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <SpeedInsights />

      {loading && (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md">
    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-purple-700 text-lg font-semibold">Carregando, aguarde um pouco...</p>
  </div>
)}
    </CartProvider>
  );
}
