import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['api.dev.phaqchas.com'], // Permite imágenes desde el servidor local
  },
};

export default nextConfig;
