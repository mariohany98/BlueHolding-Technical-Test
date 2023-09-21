/** @type {import('next').NextConfig} */

const withImages = require('next-images')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(withImages({
  images: {
    disableStaticImages: true,
    domains: ['intra-back.blueholding.co.uk', 'blue-intra-storage.s3.eu-west-1.amazonaws.com', 'erp.blueholding.co.uk']
  },
  compress: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
}))
