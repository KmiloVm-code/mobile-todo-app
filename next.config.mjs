/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar verificaciones de TypeScript en builds
  typescript: {
    // Solo durante el desarrollo inicial, cambiar a false en producción
    ignoreBuildErrors: false,
  },

  // Habilitar verificaciones de ESLint
  eslint: {
    // Solo durante el desarrollo inicial, cambiar a false en producción
    ignoreDuringBuilds: false,
  },

  // Configuración de imágenes
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Configuración experimental
  experimental: {
    // Habilitar tipado estricto para App Router
    typedRoutes: true,
  },

  // Configuración de compilación
  compiler: {
    // Remover console.log en producción
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
