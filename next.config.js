/** @type {import('next').NextConfig} */
const nextConfig = {
  // Placeholder for basePath configuration if needed in the future
  // basePath: '',
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Increase from default 1MB to 5MB for meal photos
    },
  },
  // Allow cross-origin requests from local network devices (for mobile testing)
  allowedDevOrigins: [
    '192.168.1.9', // Add your device's IP
    // You can add more IPs as needed
  ],
}

module.exports = nextConfig