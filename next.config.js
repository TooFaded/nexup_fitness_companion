/** @type {import('next').NextConfig} */
const nextConfig = {
  // Placeholder for basePath configuration if needed in the future
  // basePath: '',
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Increase to 10MB to account for base64 encoding overhead
    },
  },
  // Allow cross-origin requests from local network devices (for mobile testing)
  allowedDevOrigins: [
    "192.168.1.9", // Add your device's IP
    // You can add more IPs as needed
  ],
};

module.exports = nextConfig;
