// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*", // The path you want to use in your frontend
//         destination: "http://localhost:8000/api/:path*", // The external API destination
//       },
//     ];
//   },
//   /* config options here */
//   reactCompiler: true,
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  // We removed the async rewrites() function entirely
};

export default nextConfig;
