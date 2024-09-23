import mdx from "@next/mdx";

/** @type {import('next').NextConfig} */
const withMDX = mdx();

const nextConfig = {
  // sassOptions: {
  //   includePaths: ["styles"],
  //   prependData: `@import "./styles/global.scss";`,
  // },
  async rewrites() {
    return [
      {
        source: "/api/8080/:path*",
        destination: "http://127.0.0.1:8080/:path*", // 重寫到 8080 端口
      },
    ];
  },
  reactStrictMode: true,
  // 使用 remotePatterns 來允許從特定域名加載圖片
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  //
  webpack(config) {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: "file-loader",
        options: {
          outputPath: "static/models/",
          publicPath: "/_next/static/models/",
          name: "[name].[hash].[ext]",
        },
      },
    });

    return config;
  },
};

export default withMDX(nextConfig);
