# ThesisVerse

**AI-powered academic research discovery and thesis planning platform.**

ThesisVerse helps students and researchers discover thesis topics, explore research gaps, compare literature, manage citations, review literature, build proposals, and work with AI-assisted research tools from one interface.

## ✨ Highlights

- 🔎 Academic thesis and dissertation discovery
- 🧠 AI-assisted research insights and recommendations
- 🕳️ Research-gap and rare-discovery exploration
- 📚 Literature review and citation tools
- 📝 Thesis/proposal builder with structured sections
- 🐇 ResearchRabbit-inspired paper exploration and graph views
- 📊 Research analytics and comparison tools
- 🔐 Firebase Authentication and Cloud Firestore integration
- ⚡ React + Vite + TypeScript frontend with an Express/TypeScript server
- 📱 Responsive interface with PWA support

## 🛠️ Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Express
- Firebase Authentication
- Cloud Firestore
- Google Gemini (`@google/genai`)
- npm or Bun

## 📁 Project Structure

```text
.
├── public/                  # Static/PWA assets
├── src/                     # React application source
│   ├── components/
│   ├── data/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   └── types/
├── server.ts                # Express + Vite server entry
├── index.html               # Frontend entry document
├── firebase-applet-config.json
├── firestore.rules
├── package.json
├── bun.lock
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Run Locally

### Prerequisites

- Node.js 18+ (current LTS recommended)
- npm or Bun
- A Firebase project for authentication/database features
- A Gemini API key for Gemini-powered features
- An OpenRouter API key for OpenRouter-powered features

### 1. Install dependencies

```bash
npm install
```

or:

```bash
bun install
```

### 2. Configure environment variables

Create a local `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Then configure your secrets locally:

```env
GEMINI_API_KEY=your_real_gemini_key
OPENROUTER_API_KEY=your_real_openrouter_key
APP_URL=http://localhost:3000
```

**Never commit real API keys or other secrets.**

### 3. Start development

```bash
npm run dev
```

The development server listens on port `3000` by default.

## 📦 Production Build

```bash
npm run build
npm start
```

The build creates the Vite frontend and bundles the Express server into `dist/server.cjs`.

## 🌐 Deploying with a `.US.KG` domain

A DigitalPlat `.US.KG` domain is the **domain name**, not the web-hosting service. DigitalPlat delegates the domain to external authoritative nameservers; ordinary `A`, `AAAA`, `CNAME`, `MX`, and `TXT` records are managed by that external DNS provider.

### Recommended architecture for ThesisVerse

ThesisVerse contains an Express server and server-side AI integrations, so use a host capable of running a Node.js application rather than a static-only host.

```text
Your .US.KG domain
        │
        ▼
DigitalPlat registration
        │
        ▼
External authoritative DNS
        │
        ├── A / CNAME ──────► Your Node.js host
        │
        ▼
https://your-domain.us.kg
        │
        ▼
ThesisVerse (Vite + Express)
```

### DigitalPlat setup

1. Register your desired `.US.KG` name using the DigitalPlat FreeDomain dashboard.
2. Follow DigitalPlat's current instructions to connect external nameservers.
3. At the external DNS provider, add the DNS record(s) required by your hosting provider.
4. Add the same custom domain in your hosting provider.
5. Enable HTTPS/TLS at the hosting provider.
6. Set `APP_URL` to your final HTTPS domain.

Official DigitalPlat resources:

- DigitalPlat FreeDomain: https://github.com/DigitalPlatDev/FreeDomain
- FreeDomain dashboard: https://dash.domain.digitalplat.org/
- FreeDomain tutorial: https://github.com/DigitalPlatDev/FreeDomain/tree/main/documents/tutorial

### Important: GitHub Pages

GitHub Pages can serve the Vite frontend as a static site, but **it cannot run the Express server in this repository**. ThesisVerse currently needs its Node.js server for API routes and server-side AI calls.

If you want a GitHub Pages-only deployment later, the application must first be converted to a static/frontend-only architecture and every server endpoint must be replaced with a compatible backend or serverless function.

## 🐳 Docker / VPS Deployment

The repository includes a Docker deployment path for hosts that support containers. Build and run it with:

```bash
docker build -t thesisverse .
docker run --env-file .env -p 3000:3000 thesisverse
```

For a VPS, put Nginx, Caddy, or another reverse proxy in front of the container and point your `.US.KG` DNS record to the VPS. The proxy should terminate HTTPS and forward requests to the ThesisVerse server on port `3000`.

## 🔐 Production Security Checklist

Before opening the site to the public:

- [ ] Keep `.env` and all real API keys out of Git.
- [ ] Rotate any credential that has ever been accidentally exposed.
- [ ] Replace development/demo OAuth behavior with real production authentication.
- [ ] Tighten Firestore rules so authenticated users cannot access unrelated documents.
- [ ] Keep Gemini/OpenRouter keys server-side.
- [ ] Configure the final `APP_URL` and production OAuth redirect URLs.
- [ ] Enable HTTPS and verify the custom domain.
- [ ] Add rate limiting and abuse protection to public AI endpoints.
- [ ] Replace in-memory analytics/state with durable storage where persistence is required.
- [ ] Test `npm run lint` and `npm run build` before deployment.

## 🧪 Useful Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build frontend and production server |
| `npm start` | Start the production server |
| `npm run preview` | Preview the Vite build |
| `npm run lint` | Type-check the project |
| `npm run clean` | Remove generated build output |

## 📌 Current Status

ThesisVerse is an actively developed application foundation. The core project is deployable as a Node.js application, but production hardening is still required before a public launch, especially authentication, Firestore rules, rate limiting, durable analytics, and deployment secrets.

## 📄 License

See the repository for licensing information.

## 🔗 Links

- Repository: https://github.com/nur12islam/Thesis-Verse
- DigitalPlat FreeDomain: https://github.com/DigitalPlatDev/FreeDomain
