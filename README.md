# Maxima Enterprise website

Static, single-page site for `https://maxtransform.ai/`. The source page is `index.html`; the comparison animation is `res/short-pay-comparison.html`. The two scroll-driven workflow visuals live in the page and use `assets/workflow-visuals.css` and `assets/workflow-visuals.js`.

## Build and publish with Cloudflare Pages

1. Push this folder to a GitHub repository.
2. In Cloudflare Pages, connect that repository.
3. Set the build command to `npm run build` and output directory to `dist`. No framework preset or environment variables are needed.
4. Add `maxtransform.ai` as a custom domain and follow Cloudflare's DNS prompts. The canonical URL, social preview, and sitemap use that domain.

Run `npm run build` locally to regenerate `dist`. The build copies only the files used by the public site, so old assets do not remain in the published output.

The current Codex Sites deployment is a preview of the same source. It does not configure the Cloudflare custom domain.
