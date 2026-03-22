import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    return [
      // Proxy de WebSocket
      {
        source: "/api/ws/:path*",
        destination: `${backendUrl}/ws/:path*`,
      },
      // Proxy de todas as rotas da API
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
