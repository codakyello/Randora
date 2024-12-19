/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "asvhruseebznfswjyxmx.supabase.co",
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
