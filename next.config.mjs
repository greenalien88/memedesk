/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/launchpad/:slug*',
        destination: '/alpha/:slug*',
        permanent: true,
      },
      {
        source: '/news',
        destination: '/highlights',
        permanent: true,
      },
      {
        source: '/news/:slug*',
        destination: '/highlights/:slug*',
        permanent: true,
      },
      {
        source: '/market-pulse',
        destination: '/runner-pulse',
        permanent: true,
      },
      {
        source: '/market-pulse/:slug*',
        destination: '/runner-pulse/:slug*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
