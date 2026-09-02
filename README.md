# ThesisVerse

**AI-assisted academic research discovery and thesis planning platform.**

ThesisVerse helps students and researchers discover literature, explore research gaps, compare papers, save useful work, inspect AI-assisted insights, and turn promising research directions into structured proposals.

## ✨ What ThesisVerse does

- 🔎 Search and discover theses, dissertations, papers, and related research
- 🧭 Explore a research landscape instead of treating AI output as a final answer
- 🕳️ Surface potentially underexplored research directions with supporting evidence
- 📚 Read paper metadata, abstracts, citations, methodology, limitations, and future directions
- 🤖 Use AI-assisted abstract simplification, translation, search insights, and multi-agent perspectives
- 🔖 Save papers and compare candidates while researching
- 📝 Turn a promising paper/topic into a structured research proposal
- 🐇 Explore literature relationships with ResearchRabbit-inspired mapping tools
- 🔐 Authenticate with Firebase and store user-owned data in Cloud Firestore
- 📱 Use the responsive interface on desktop, tablet, and mobile

> **Research caution:** ThesisVerse should describe an area as *potentially underexplored* rather than claiming that a topic has never been researched. AI-generated gaps and recommendations should always be checked against the underlying literature.

## 🎨 Design direction

The interface uses a restrained academic/editorial visual system rather than an overly futuristic AI aesthetic:

- Deep green / sage accents
- Warm white surfaces in light mode
- Deep green-black surfaces in dark mode
- Serif-led research typography with compact utility controls
- Clear paper metadata and evidence-first cards
- Responsive layouts designed for touch as well as desktop use

## 🛠️ Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Express
- Firebase Authentication
- Cloud Firestore
- Google Gemini (`@google/genai`)
- OpenRouter
- npm or Bun

## 📁 Project Structure

```text
.
├── public/                  # Static/PWA assets
├── src/                     # React application source
│   ├── components/          # Shared UI components
│   ├── data/                # Local/static research data
│   ├── lib/                 # Firebase and shared utilities
│   ├── pages/               # Application screens
│   ├── services/            # API and AI service calls
│   └── types/               # Shared TypeScript models
├── scripts/                 # Build-time server preparation
├── server.ts                # Express + Vite development server entry
├── index.html               # Frontend entry document
├── firebase-applet-config.json
├── firestore.rules
├── package.json
├── bun.lock
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Run locally

### Prerequisites

- Node.js 20+ recommended
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

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Then configure your local secrets:

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

## 📦 Production build

```bash
npm run build
npm start
```

The build produces the Vite frontend in `dist/` and bundles the production Express server as `dist/server.cjs`.

For a local production-style run:

```bash
npm run build
NODE_ENV=production PORT=3000 npm start
```

## 🌐 Production deployment

ThesisVerse contains an Express server and server-side AI integrations, so the complete application needs a Node.js-capable host rather than a static-only host.

The current production deployment uses **Render Web Service** with the custom domain:

**`https://thesisverse.dpdns.org`**

Deployment flow:

```text
thesisverse.dpdns.org
        │
        ▼
DigitalPlat domain delegation
        │
        ▼
DNS records
        │
        ▼
Render Web Service
        │
        ├── Vite frontend
        └── Express + server-side AI APIs
```

### Render configuration

Use the repository's native Node build rather than the Dockerfile for the simplest Render deployment:

```text
Build command: npm install && npm run build
Start command: npm start
```

Set the required environment variables in the hosting provider's environment/secrets settings:

```env
GEMINI_API_KEY=your_real_gemini_key
OPENROUTER_API_KEY=your_real_openrouter_key
APP_URL=https://thesisverse.dpdns.org
```

Do **not** put provider API keys in the frontend or commit them to Git.

### Custom domain / DNS

The domain `thesisverse.dpdns.org` is registered through DigitalPlat and is connected to the production Render service. HTTPS is provided by the hosting layer after the custom domain is verified.

The original `.US.KG` domain idea is currently not used because `.US.KG` registration is paused on the DigitalPlat side. The application therefore uses the working `dpdns.org` domain instead.

## 🔐 Firebase setup

The frontend uses Firebase Authentication and Cloud Firestore.

Before production use:

1. Add the production hostname to Firebase Authentication's authorized domains.
2. Enable the authentication providers required by the application.
3. Create the Firestore database in production mode.
4. Publish the repository's `firestore.rules` after reviewing them against the data model.
5. Keep privileged credentials and AI provider keys on the server.

The repository intentionally avoids a global authenticated read/write Firestore fallback. New collections should receive narrowly scoped rules before the application starts writing to them.

## 🧪 Quality checks

Run these before deployment:

```bash
npm run lint
npm run build
```

The GitHub Actions workflow also performs TypeScript checking and a production build on pushes and pull requests targeting `main`.

## 🐳 Docker / VPS deployment

A Dockerfile is included for hosts that support containers.

```bash
docker build -t thesisverse .
docker run --env-file .env -p 3000:3000 thesisverse
```

For a VPS, put Nginx, Caddy, or another reverse proxy in front of the application, terminate HTTPS at the proxy, and forward traffic to the ThesisVerse server.

## 📜 Useful scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the frontend and production server |
| `npm start` | Start the production server |
| `npm run preview` | Preview the Vite frontend build locally |
| `npm run lint` | Type-check the project |
| `npm run clean` | Remove generated build output |

## 🛡️ Production hardening checklist

- [x] Keep real API keys out of Git
- [x] Use Firebase Authentication for real sign-in
- [x] Add production hosts to Firebase authorized domains
- [x] Lock down Firestore with user-scoped rules
- [x] Keep Gemini/OpenRouter keys server-side
- [x] Configure the production `APP_URL`
- [x] Verify the production custom domain and HTTPS
- [x] Add a production build/typecheck workflow
- [ ] Add rate limiting and abuse protection to public AI endpoints
- [ ] Move analytics/state that must persist into durable storage
- [ ] Add broader automated tests for critical user flows
- [ ] Complete a final security/privacy review before a public launch

## 📌 Current status

ThesisVerse is deployable as a Node.js application and is currently connected to Firebase Authentication/Firestore and a production Render service. The research-result experience and broader interface are being refined toward an evidence-first academic discovery workflow.

The application should still be treated as an active development project until rate limiting, durable analytics, automated coverage, and the final security/privacy review are completed.

## 📄 License

See the repository for licensing information.

## 🔗 Links

- Repository: https://github.com/nur12islam/Thesis-Verse
- Production site: https://thesisverse.dpdns.org
- DigitalPlat FreeDomain: https://github.com/DigitalPlatDev/FreeDomain
