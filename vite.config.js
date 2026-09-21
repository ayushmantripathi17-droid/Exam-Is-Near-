import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { resolve } from "path";

// Vite root = public/, since that's where index.html + every other HTML
// entry + the new src/ ES module tree live (see MIGRATION_NOTES.md for why
// public/js/ was replaced by public/src/). Build output goes to dist/ at
// the project root - point firebase.json's "hosting.public" at "dist"
// (instead of "public") and run `npm run build` before every deploy.
export default defineConfig({
  root: "public",
  base: "/",
  publicDir: false, // no automatic passthrough dir - see viteStaticCopy below instead
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "public/index.html"),
        admin: resolve(__dirname, "public/admin.html"),
        finance: resolve(__dirname, "public/finance.html"),
        landing: resolve(__dirname, "public/landing.html"),
        rankJEE: resolve(__dirname, "public/rankJEE.html"),
        rankNEET: resolve(__dirname, "public/rankNEET.html"),
        privacy: resolve(__dirname, "public/privacy.html"),
        terms: resolve(__dirname, "public/terms.html"),
        // NOTE: pro_modal.html intentionally excluded - it's a developer
        // reference snippet (instructions + markup to copy into index.html
        // by hand), not valid standalone HTML, and was never a deployed
        // page. See its own header comment.
      },
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "assets", dest: "." },
        { src: "seo", dest: "." },
        { src: "manifest.json", dest: "." },
        { src: "sw.js", dest: "." },
        { src: "robots.txt", dest: "." },
        { src: "sitemap.xml", dest: "." },
        { src: "ads.txt", dest: "." },
        { src: "BingSiteAuth.xml", dest: "." },
        { src: "googleec3e31e16694f623.html", dest: "." },
        { src: "favicon.ico", dest: "." },
        { src: "favicon-32.png", dest: "." },
        { src: "apple-touch-icon.png", dest: "." },
        { src: "icon-192.png", dest: "." },
        { src: "icon-192-maskable.png", dest: "." },
        { src: "icon-512.png", dest: "." },
        { src: "icon-512-maskable.png", dest: "." },
        { src: "og-image.png", dest: "." },
      ],
    }),
  ],
});
