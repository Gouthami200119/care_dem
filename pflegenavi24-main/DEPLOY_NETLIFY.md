# Deploy to Netlify ✅

1. Build the static site:
   `npm run build` (outputs `dist/`).
2. Ensure `public/_redirects` exists (it will be copied into `dist/`) with the single line:
   `/* /index.html 200`
   This enables client-side routing for an SPA on Netlify.
3. Manually deploy by dragging the `dist/` folder to Netlify (Sites → New site → Deploy → Drag & drop your folder).

## Security & server-side secrets ⚠️
- **Do not** embed secret API keys in client-side code. Keys placed in `VITE_` vars will be bundled into your frontend and visible to users.
- For private keys (like a Gemini API secret), use Netlify environment variables (Site settings → Build & deploy → Environment → Environment variables) and call the external API from a serverless function (Netlify Function) that has access to `process.env.GEMINI_API_KEY`.

Example function stub: `netlify/functions/gemini-proxy.js` (included).

**Important:** Drag-and-drop deploys only upload static files and DO NOT deploy Netlify Functions. To publish functions, use Git-based deploys or the Netlify CLI (`netlify deploy --prod`) so your `netlify/functions/` code is built and uploaded.

## Optional (Git-based deploys)
- `netlify.toml` sets `publish = "dist"` and `command = "npm run build"`, so Netlify will build & publish `dist/` automatically when you push to the linked repo.

## Clean up local secrets
- Remove any local `env` file containing real keys and keep `.env.example` in the repo instead.
