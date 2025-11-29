import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // atur hostname dari endpoint luar atau web
  images:{
    remotePatterns: [
      {
        hostname: 'www.almumtaz.com.pk',
        protocol: 'https',
      }
    ]
  }
  
};

export default withPayload(nextConfig);