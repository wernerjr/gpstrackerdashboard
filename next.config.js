/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração básica
  reactStrictMode: true,
  
  // Otimização de assets
  optimizeFonts: true,
  
  // Configuração do webpack
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx']
    };
    return config;
  },

  // Configuração de paths estáticos
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
};

module.exports = nextConfig; 