import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
        // port: "", // 기본 443 HTTPS
        // pathname: "/**" // 경로 제한 가능, 기본 전체 허용
      },
      {
        protocol: "https",
        hostname: "customer-mgkas9o5mlq4q3on.cloudflarestream.com",
      },
      {
        protocol: "https",
        hostname: "flowbite.com",
      },
      {
        protocol: "https",
        hostname: "velog.velcdn.com",
        port: "",
        pathname: "/**", // velog의 모든 경로 허용
      },
    ],
  },
};

export default withFlowbiteReact(nextConfig);
