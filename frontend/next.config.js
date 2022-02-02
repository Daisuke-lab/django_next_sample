/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.HOGE,
  },
  swcMinify: false,
};
