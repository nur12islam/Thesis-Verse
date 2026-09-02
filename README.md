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
- 🔐 Firebase Authentication and Firestore integration
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
- Bun/npm-compatible dependency workflow

## 📁 Project Structure

```text
.
├── public/                  # Static/PWA assets
├── src/
│   ├── components/          # UI, AI tools, proposal, workspace and discovery features
│   ├── data/                # Seed thesis/research data
│   ├── lib/                 # Firebase and graph helpers
│   ├── pages/               # Application pages
│   ├── services/            # API/workspace services
│   └── types/               # Shared TypeScript types
├── server.ts                # Express + Vite development/server entry
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

- Node.js 18+ (or a current LTS release)
- npm or Bun
- Firebase project credentials/configuration
- Gemini API key for AI features
- OpenRouter API key for features that use OpenRouter

### 1. Install dependencies

Using npm:

```bash
npm install
```

Or Bun:

```bash
bun install
```

### 2. Configure environment variables

Create a local `.env` file. **Never commit real API keys.**

Start from the provided example:

```bash
cp .env.example .env
```

Add your real secrets locally, for example:

```env
GEMINI_API_KEY=your_real_gemini_key
OPENROUTER_API_KEY=your_real_openrouter_key
APP_URL=http://localhost:3000
```

The repository's `.gitignore` excludes `.env` files while keeping `.env.example` available as a safe template.

### 3. Start the development server

```bash
npm run dev
```

Or:

```bash
bun run dev
```

The app is served by the Express/Vite server on port `3000` by default.

## 📦 Production Build

Build both the Vite frontend and bundled server:

```bash
npm run build
```

Then run:

```bash
npm start
```

## 🌐 Hosting on a `.US.KG` domain

ThesisVerse can use a custom `.US.KG` domain, but **DigitalPlat FreeDomain is the domain-registration/delegation layer, not the web host**. DigitalPlat's documentation explains that ordinary DNS records are managed at an external authoritative DNS provider, while your web host serves the application. citeturn346508search1turn346508search4

### Recommended deployment model

Because ThesisVerse uses an Express server as well as Vite, deploy it to a host that can run a Node.js server. GitHub Pages is suitable for static frontend deployments, but it does not run the Express server contained in this repository.

A typical setup is:

```text
DigitalPlat .US.KG domain
        ↓
External authoritative DNS
        ↓
Node.js hosting provider
        ↓
ThesisVerse (Vite + Express)
```

DigitalPlat's official repository provides the current dashboard/tutorial flow for registering a `.US.KG` domain and delegating it to external nameservers. citeturn16file0

### Domain setup

1. Register your `.US.KG` domain through the DigitalPlat FreeDomain dashboard.
2. Configure the assigned external nameservers in DigitalPlat.
3. In your external DNS provider, create the records required by your hosting provider.
4. Configure the same custom domain in the hosting provider and enable HTTPS.

DigitalPlat explicitly notes that its dashboard does **not** provide the ordinary A/CNAME record editor; those records are created at the external DNS service. citeturn346508search4turn349326search2

## ☁️ GitHub Pages Note

GitHub Pages can host a static website and supports custom domains, including apex-domain DNS configuration. citeturn346508search6turn346508search5

However, this repository currently contains a server-side Express application (`server.ts`) and AI integrations that depend on server environment variables, so **do not treat GitHub Pages as a full replacement for the Node.js server**. The frontend can be built separately as static assets if you intentionally redesign the deployment architecture.

## 🔐 Security

- Never commit `.env` or real API keys.
- Rotate any API credential that has previously been exposed.
- Review Firebase Authentication and Firestore rules before production deployment.
- Keep server-side API keys on the hosting provider, not in frontend source code.
- Review OAuth callback/production authentication flows before enabling public sign-in.

## 🧪 Useful Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build frontend and server |
| `npm start` | Start the production server |
| `npm run preview` | Preview the Vite build |
| `npm run lint` | Run TypeScript type-checking |
| `npm run clean` | Remove generated build output |

## 📌 Current Status

ThesisVerse is an actively developed prototype/application foundation. Some integrations and production hardening may still be required before public launch, especially authentication, Firestore security rules, external API configuration, and deployment infrastructure.

## 📄 License

See the repository for licensing information.

## 🔗 Repository

https://github.com/nur12islam/Thesis-Verse

## 🌐 DigitalPlat FreeDomain

https://github.com/DigitalPlatDev/FreeDomain
