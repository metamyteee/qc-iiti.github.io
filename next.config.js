/** @type {import('next').NextConfig} */
const nextConfig = {
  // This site deploys as static HTML to qc-iiti.github.io (a GitHub user/org
  // page), so it must be built as a static export rather than run through
  // a Node server. Without this, `next build` produces a server build that
  // GitHub Pages cannot run.
  output: 'export',

  // GitHub Pages serves each route as a real folder with an index.html
  // inside it (e.g. /projects/index.html), so trailing slashes are required
  // for links to resolve correctly without a server doing URL rewriting.
  trailingSlash: true,

  images: {
    // next/image's optimization API needs a server; static export can't
    // run it, so images are served as-is.
    unoptimized: true,
  },
};

module.exports = nextConfig;
