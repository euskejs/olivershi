# Oliver Shi Website — Design and Implementation Guide

This file records the implemented website and accepted design direction. Keep it aligned with `index.html`, `styles.css`, and `server/background.mjs` when making changes.

## Objective
Create a modern, premium personal website for Oliver Shi that positions him as a technology investor with deep technical credibility, strong software and AI interest, and a long-term investment lens. The site should feel elevated, institutional, and intellectually grounded rather than generic or overly personal.

## Core brand position
Oliver is not just a finance professional or a technologist. He sits at the intersection of:
- software
- enterprise technology
- artificial intelligence
- long-term investing

The website should communicate a clear thesis:
> Technical understanding creates better investment judgment.

The tone should be thoughtful, confident, and quietly ambitious.

## Audience
Primary audiences:
- founders and operators in software and AI
- peers in investment and technology circles
- recruiters, network contacts, and institutional stakeholders

## Design direction
### Visual style
- Modern, premium, dark-first aesthetic
- Clean and editorial layout with spacious composition
- High-contrast typography with restrained accent color
- Warm metallic accent (gold / bronze) on deep navy / charcoal background
- Minimal but intentional motion and micro-interactions
- Elegant system-driven visuals instead of loud decorative graphics

### Visual language
Use a restrained technology-inspired aesthetic:
- geometric grids
- layered planes / architectural forms
- subtle patterns suggesting infrastructure, software systems, and intelligence
- polished, not gimmicky

### Implemented palette
- Navy / midnight: #101F2C
- Secondary navy: #173042
- Text ink on ivory: #142A38
- Warm ivory / paper: #F5F3ED
- Muted gray: #667782
- Gold / bronze accent: #BBA27B
- Light-section borders: rgba(20, 42, 56, 0.12)
- Dark-section text uses lighter gray for contrast; bronze text on ivory uses #806444.

### Typography
- Headline / editorial: Cormorant Garamond, with Georgia fallback
- Body / UI: Inter, with Arial fallback
- Keep typography crisp and premium; avoid overly playful branding

## Content strategy
The site should present Oliver as:
- a software investor at TPG
- someone with a strong technical foundation in computer science
- someone with prior M&A experience in technology at Lazard
- someone with a finance background from Wharton
- someone with genuine curiosity in AI and how technology changes business

## Site structure
The site is a single page with anchor navigation. Secondary pages are not implemented.

1. Hero
   - “Investing where technical depth meets durable value.”
   - Technology investor at TPG; software investing, technology M&A, and finance + CS credentials.
   - Primary CTA: Explore focus. Secondary CTA: LinkedIn.
   - Decorative architectural linework built as inline SVG.
2. About (`#about`)
   - “Understanding the technology. Seeing the possibility.”
   - Concise biography connecting investing experience and technical education.
   - Portrait extracted from the supplied `Oliver.pdf`, saved as `assets/oliver-shi.jpg`. Use the existing square image, subtle frame, and CSS saturation treatment. It appears beside the text on desktop and above it on mobile.
3. Focus (`#focus`), in this exact order
   - Artificial intelligence
   - Software
   - Enterprise technology
   - Growth investing
4. Background (`#background`)
   - Career: TPG, Associate in San Francisco, 2025–present; Lazard technology M&A, grouped as 2022–2025 including the 2022 summer analyst role. Do not imply uninterrupted full-time employment beginning in 2022.
   - Education: both Penn degrees, 2019–2023. Preserve the degree titles separately from the short descriptions.
   - Wharton: B.S. in Economics, Finance concentration. Description: “Finance and business management.”
   - Penn CS: Bachelor of Applied Science in Computer Science. Description: “Computer systems and data analytics.”
   - Earlier roles, extended teaching/research descriptions, and certifications are not displayed.
5. Perspective
   - “Technical depth. Long-term conviction.”
   - Three concise points about technical fluency, AI, and enduring business value.
6. Contact (`#contact`)
   - “Let’s talk about what comes next.”
   - LinkedIn: https://www.linkedin.com/in/olivershi
   - No public email address is supplied; do not invent one.
7. Optional chat window
   - Launcher: “Ask about Oliver”. Heading: “Get to know Oliver”.
   - Subtitle: “AI assistant · Oliver’s background and interests”.
   - Opens only when selected; provides suggested questions, follow-ups, reset, and background/LinkedIn links.
   - Clearly represents an AI assistant, not Oliver personally or TPG.

## Background chat behavior
- Browser code in `script.js` calls `/api/chat`; `api/chat.js` calls the OpenAI Responses API.
- `server/background.mjs` is the curated public knowledge source. Update it together with biography changes. Do not upload the source PDFs or add unsupported facts.
- Answers are instructed to stay within the public background, acknowledge unknown information, avoid investment advice, and never invent deals, personal opinions, availability, or employer positions. These are model instructions, not guarantees; test real replies before launch.
- The default model is `gpt-4.1-mini`; `OPENAI_MODEL` can override it. `OPENAI_API_KEY` is server-only. Without a key, show the existing unavailable message and preserve the question for retry.
- Messages are kept in browser memory, cleared by refresh or New chat, and sent to OpenAI on submission with up to five previous exchanges. The app does not persist or log conversations; `store: false` does not override OpenAI's applicable retention policies.
- Render responses as plain text. Preserve the processing notice, keyboard access, Escape-to-close, and focus return.
- Current limits: 600-character question, 11 messages, 16KB JSON body, 350 output tokens, 20-second upstream timeout. The in-memory 10 requests/minute/IP throttle is per instance and resets on cold starts. Configure a platform rate limit before public launch; this code does not provide a global cost cap.

## Project and deployment
- Repository: https://github.com/euskejs/olivershi, production branch `main`.
- Semantic HTML, CSS, browser JavaScript, and a Node.js API function; no third-party runtime dependencies.
- `npm run dev`: local preview. `npm test`: mocked API tests. `npm run build`: static assets in `dist/`. `npm start`: preview built assets with the local API handler.
- Vercel: Other framework preset, repository root, build command `npm run build`, output directory `dist`. Root `api/chat.js` is deployed separately as a Vercel Function; do not copy server code into `dist/`.
- API keys belong in local ignored environment files or Vercel environment settings. `.env.example` contains placeholders only.
- Exclude source PDFs, `.venv/`, credentials, and `dist/` from Git. The extracted portrait is a public website asset and is tracked.
- Intended canonical domain: `olivershi.com`, already referenced by page metadata, sitemap, and robots.txt. Follow the domain verification instructions in Vercel; update those files if a different canonical domain is chosen.
- Detailed deployment and activation steps are in `README.md`. Deployment and live API verification must be reported from observed results, not assumed from a passing local build.

## Messaging principles
- Be concise and premium rather than verbose
- Avoid generic “I am passionate about technology” language
- Ground the story in evidence: academic rigor, engineering experience, investing roles, operating and technical exposure
- Emphasize depth and judgment over hype
- Position AI as a meaningful part of the software and enterprise opportunity set, not as a slogan

## Suggested voice
The voice should feel:
- thoughtful
- precise
- modern
- confident
- quietly sophisticated

## Key phrases to use
- Technology investor
- Software and enterprise technology
- Artificial intelligence and the next generation of software
- Technical lens, long-term perspective
- Investing where software compounds
- Understanding the technology. Seeing the possibility.
- Technical depth. Long-term conviction.

## Design quality bar
The final site should feel:
- premium and credible
- distinctly tailored to Oliver
- more like a focused investor brand than a generic profile
- clean enough to feel timeless
- polished enough to stand alongside modern VC and growth-investing websites

## Implementation guidance
When changing the implementation:
- keep the layout spacious and breathable
- preserve navy hero/focus/contact sections and warm ivory About/Background sections
- preserve visible mobile navigation, skip link, keyboard focus, and reduced-motion support
- let typography do the heavy lifting
- use subtle accent styling and selective geometric graphics
- avoid over-interaction or excessive animation
- balance clarity, scarcity of content, and sophistication in typography

## Success criteria
The site succeeds when it feels like:
- an investor brand with real technical credibility
- a polished personal platform for founders and peers
- a modern representation of software + AI + growth investing
- a clear articulation of Oliver’s perspective without overexplaining himself
