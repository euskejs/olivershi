# Oliver Shi

A responsive personal website for Oliver Shi, a software investor at TPG with a computer science background and an interest in AI. Built with semantic HTML, CSS, browser JavaScript, and a small Node.js chat endpoint. No third-party runtime dependencies.

## Local preview

Requires Node.js 20 or later. Run `npm run dev`, then open http://localhost:3000.

Run `npm run build` to generate `dist/`. Run `npm start` to preview the production build.

## Deploy to Vercel

1. Sign in at [Vercel](https://vercel.com/new) with GitHub. Choose **Add New → Project**, find `euskejs/olivershi`, and select **Import**. If missing, grant the Vercel GitHub integration access to this repository.
2. Confirm the project configuration:

   | Setting | Value |
   | --- | --- |
   | Project name | `olivershi` (or another available name) |
   | Framework preset | Other |
   | Root directory | Repository root (`./`), not `dist` |
   | Build command | `npm run build` |
   | Output directory | `dist` |
   | Install command | Leave the default |
   | Production branch | `main` |

   `vercel.json` already supplies the framework, build, and output settings. The website assets are served from `dist`; Vercel builds root `api/chat.js` as a separate Node function. Do not use `npm start` as the build command.
3. Add `OPENAI_API_KEY` as a server-side environment variable to enable chat. `OPENAI_MODEL=gpt-4.1-mini` is optional because it is already the code default. Apply the key to Production; include Preview only if you want preview deployments to make billable AI calls. You can deploy without a key, but chat will show an unavailable message. Never commit the key.
4. Click **Deploy**. Wait for **Ready**, then visit the generated `.vercel.app` address. Confirm the portrait, navigation, mobile layout, and the `/api/chat` function in the deployment output.
5. Test chat from the website: ask about education, ask a follow-up, then ask for a fact not supplied in the biography (for example, specific deals). Verify grounded answers and acknowledgment of unknown information. A browser GET to `/api/chat` returns 405 by design; use the chat form to send POST requests. For failures, inspect the deployment's runtime logs and verify key, model access, and API billing. After changing an environment variable, redeploy; existing deployments do not receive the change.
6. Before public launch, use the project's Firewall controls to add a rate-limit rule matching `/api/chat`, with a starting threshold of 10 requests per 60 seconds per IP and a block action. Check the available options and plan limits in your dashboard. The existing per-instance throttle is not a global usage cap; monitor API usage as well.
7. If you control `olivershi.com`, open **Settings → Domains** and add it. Optionally add `www.olivershi.com` and redirect it to the apex domain. At your DNS provider, enter the exact records Vercel shows and wait for valid configuration and HTTPS. Avoid copying generic DNS values; use the values assigned to this project. If you choose a different permanent domain, update `index.html`, `robots.txt`, and `sitemap.xml` accordingly.
8. Once linked, future pushes to `main` automatically trigger production deployments. Other branches can create preview deployments. Verify a production deployment after each release.

References: [Git imports](https://vercel.com/docs/git), [environment variables](https://vercel.com/docs/environment-variables), [custom domains](https://vercel.com/docs/domains/working-with-domains/add-a-domain), [firewall rate limits](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting).

## Editing

- Biography and navigation: `index.html`.
- Colors, typography, and responsive layout: `styles.css`.
- Architectural artwork: inline SVG in `index.html`.
- Favicon: `assets/favicon.svg`.
- About portrait: `assets/oliver-shi.jpg`, extracted from `Oliver.pdf`; its muted treatment is applied in CSS.

Google Fonts supplies Inter and Cormorant Garamond; local system fonts are fallbacks. The site respects reduced-motion preferences and includes keyboard focus styles and a skip link.

Content is based on the supplied `Profile.pdf`, the user's biography, and [Oliver's LinkedIn profile](https://www.linkedin.com/in/olivershi), checked September 13, 2026. The PDF supplies exact degree titles, employment dates, role titles, and specialties. Wharton summa cum laude honors were verified from the public LinkedIn profile. The Background section features TPG and Lazard, both Penn degrees, and concise education summaries. PDF relative tenure durations are omitted in favor of explicit dates. LinkedIn remains the preferred contact destination. The source PDFs are not included in the production build. The site is prepared for deployment, but has not been published.

## Design direction

`AGENT.md` defines the investor positioning and visual direction. The homepage pairs navy and warm ivory with bronze accents, serif headlines, and architectural SVG linework. Four focus areas appear in this order: artificial intelligence, software, enterprise technology, and growth investing. Mobile navigation stays visible in two rows; the site includes a skip link, visible keyboard focus, and reduced-motion support. LinkedIn is the contact route; no email address has been supplied.

## Background chat

“Ask about Oliver” opens an accessible dialog with suggested questions, a short conversation, and links to the background and LinkedIn. It uses the [OpenAI Responses API](https://developers.openai.com/api/docs/guides/text) through `api/chat.js`, a [Vercel Node function](https://vercel.com/docs/functions/runtimes/node-js). The key stays on the server. `server/background.mjs` holds the curated public facts; update it whenever the biography changes. The assistant is instructed to acknowledge unknown facts and never impersonate Oliver or TPG.

Set `OPENAI_API_KEY` in Vercel environment settings and redeploy to enable replies. `OPENAI_MODEL` is optional and defaults to `gpt-4.1-mini`. API usage requires an OpenAI API account with billing. Do not put a key in HTML, browser JavaScript, or source control.

For local chat, copy `.env.example` to `.env`, fill the key locally, and run `node --env-file=.env scripts/serve.mjs` (Node 20.6+). `npm run dev` also accepts environment variables supplied by your shell. Without a key, the chat shows an honest unavailable message and retains the question for retry. `npm start` serves the production assets and the same local API handler. The local server serves only public asset paths, not source files, PDFs, or environment files.

Messages stay in browser memory until refresh or “New chat”; the application does not persist or log conversations. Submitted questions and up to five previous exchanges are sent to OpenAI with `store: false`; OpenAI's applicable API retention policies still apply. The chat displays this processing notice before sending. Answers are rendered as plain text.

Requests are limited to 600 characters for the new question, 11 messages, 16KB of JSON, 350 output tokens, and a 20-second upstream timeout. A best-effort in-memory throttle allows 10 requests/minute per IP per function instance. This resets on cold starts and is not a global spending cap; configure a Vercel firewall rate limit for `/api/chat` before public launch and monitor API usage. Cross-origin browser requests are rejected, but the endpoint is public.

Run `npm test` for API validation, grounding payload, throttle, and failure-handling tests using mocked OpenAI responses. Live reply quality and deployed rate-limit behavior must also be checked with the configured API account before launch.
