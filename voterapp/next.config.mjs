/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*", // The path you want to use in your frontend
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/:path*`, // The external API destination
      },
    ];
  },
  //${process.env.NEXT_PUBLIC_BACKEND_URL}
  //http://localhost:8000
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
//   reactCompiler: true,
//   // We removed the async rewrites() function entirely
// };

// export default nextConfig;
