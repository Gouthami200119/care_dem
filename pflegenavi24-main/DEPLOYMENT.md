Deployment Guide — Vercel & Netlify

Overview

This project is a Vite + React app that calls Gemini through server-side functions to keep your API key secret. The serverless endpoints are:
- Vercel: `/api/gemini` (file: `api/gemini.ts`)
- Netlify: `/.netlify/functions/gemini` (file: `netlify/functions/gemini.ts`)

Vercel

1. Push repository to GitHub.
2. In Vercel, import the repository.
3. In Project Settings → Environment Variables, add `GEMINI_API_KEY` (set for Preview/Production as needed).
4. Deploy. Vercel will run `npm run build` and publish `dist`.

Netlify

1. Push repository to GitHub.
2. Create a new site in Netlify from Git and select your repo.
3. In Site Settings → Build & deploy → Environment, add `GEMINI_API_KEY`.
4. Build command: `npm run build`. Publish directory: `dist`.

Local Development

- `npm install`
- Create `.env.local` with:
  GEMINI_API_KEY=your_key (optional for local testing; using it locally will put key in your environment only)
- `npm run dev`
- If the server-side function or key is missing, the app will operate in Demo Mode with a friendly message.

Security Notes

- Never commit secrets to the repo.
- Keep server-side API usage behind serverless functions to avoid leaking keys in the browser.

IMPORTANT: I found an `env` file containing `GEMINI_API_KEY` in the repository. I replaced its contents with a warning message and added `env` and `.env*` to `.gitignore`. You should:

1. Rotate the exposed Gemini API key immediately.
2. Remove the file from git (`git rm env` and commit), and consider rewriting history if the secret was pushed.
3. Store secrets in your deployment platform environment settings (Vercel/Netlify) or local `.env.local` which is gitignored.

If you'd like, I can: (A) prepare a production-ready PR with these changes in a branch, and/or (B) help you connect your GitHub repo to Vercel/Netlify and walk through adding `GEMINI_API_KEY` and deploying live. Let me know which you prefer.
