/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/f/**", // This allows any path under /f/
      },
      {
        protocol: "https",
        hostname: "6hkxda8pcu.ufs.sh",
        port: "",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "asvhruseebznfswjyxmx.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "oaidalleapiprodscus.blob.core.windows.net", // Add this
        pathname: "/private/**", // Matches the path for DALL-E image URLs
      },
    ],
    domains: [
      "unsplash.it",
      "oaidalleapiprodscus.blob.core.windows.net", // Add this
    ],
  },
};

export default nextConfig;
