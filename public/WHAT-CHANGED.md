# What's in this zip

Your firebase.json already had correct headers for robots.txt/sitemap.xml,
security headers, and CSP — no changes needed there.

Your index.html already had solid title/description/OG/Twitter/canonical
tags — no changes needed there either. The only edit: added 3 JSON-LD
structured data blocks (Organization, WebSite, EducationalOrganization)
right after the existing brand meta tags, so Google can understand the
site/brand beyond just the title tag.

## Files
- `index.html` — your file + JSON-LD added. Replace your current one with this.
- `robots.txt` — new. Put in `public/` (root).
- `sitemap.xml` — new. Put in `public/` (root). Only lists routes that
  actually exist as static pages per your firebase.json rewrites
  (`/`, `/neet/rank`, `/jee/rank`, `/privacy.html`, `/terms.html`).
  `/course/**` is dynamic (per-course id) so it's not listed — add specific
  course URLs here if you want individual courses indexed.

## Still worth checking (didn't touch, can't verify from here)
- Confirm `/og-image.png`, `/favicon.ico`, `/apple-touch-icon.png`,
  `/logo_transparent__1_.png` physically exist in `public/` — index.html
  references them but a 404 on any breaks link previews / favicon in search.
- Submit `sitemap.xml` in Google Search Console once deployed.
