/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Novo padrão para a sua API online no Render
      {
        protocol: 'https',
        // IMPORTANTE: Substitua pelo hostname da sua URL do Render
        hostname: 'https://loja-backend-rxwb.onrender.com', 
        port: '', // Deixe a porta vazia para o padrão HTTPS (443)
        pathname: '/assets/**',
      },

      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**', // Permite qualquer caminho vindo deste hostname
      },

    ],
  },
};

// ---- INÍCIO DA CORREÇÃO ----
// Alterado de module.exports para export default para ser compatível com ES Modules (.mjs)
module.exports = nextConfig;
// ---- FIM DA CORREÇÃO ----
