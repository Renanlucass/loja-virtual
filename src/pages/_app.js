import "@/styles/globals.css";
import Layout from '../components/Layout';
import { CartProvider } from "@/context/CartContext";
import Head from 'next/head';

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Head>
        <link rel="icon" href="/logo-maria.png" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartProvider>
  );
}
