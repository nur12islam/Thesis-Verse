import fs from "node:fs";

const sourcePath = "server.ts";
const outputPath = ".generated-server.ts";

let source = fs.readFileSync(sourcePath, "utf8");

// Production port: Render and similar hosts provide PORT at runtime.
source = source.replace(
  'const PORT = 3000;',
  'const PORT = Number(process.env.PORT) || 3000;'
);

// Ensure the production server is reachable from Render's public network interface.
source = source.replace(
  /app\.listen\(PORT,\s*\(\) =>/,
  'app.listen(PORT, "0.0.0.0", () =>'
);

// Remove the obsolete demo OAuth endpoints. Authentication is handled by Firebase in the client.
source = source.replace(
  /\/\/ OAuth Auth URL Endpoint[\s\S]*?\/\/ Health Check/,
  '// Production authentication is handled by Firebase Auth on the client.\n\n// Health Check'
);

// Register the deep-research fallback without changing the existing search API.
if (!source.includes('registerDeepResearchRoutes')) {
  source = source.replace(
    'import { INITIAL_THESES, POPULAR_TOPICS, CATEGORIES_LIST, RARE_DISCOVERY_IDEAS } from "./src/data/thesesData.js";',
    'import { INITIAL_THESES, POPULAR_TOPICS, CATEGORIES_LIST, RARE_DISCOVERY_IDEAS } from "./src/data/thesesData.js";\nimport { registerDeepResearchRoutes } from "./server/deepResearch.js";'
  );
  source = source.replace(
    'app.use(express.json({ limit: "1mb" }));',
    'app.use(express.json({ limit: "1mb" }));\n\nregisterDeepResearchRoutes(app);'
  );
}

// Replace legacy hard-coded production URL references.
source = source.replaceAll("https://thesisverse.org", "https://thesisverse.dpdns.org");

// Use OpenRouter's current free-model router instead of relying on individual free model IDs
// that can change or become unavailable. The router selects an available free model and
// supports the same chat-completions interface used by ThesisVerse.
source = source.replace(
  'let preferredModel = "meta-llama/llama-3.3-70b-instruct:free";',
  'let preferredModel = "openrouter/free";'
);
source = source.replace(
  /const openRouterModelsToTry = Array\.from\(new Set\(\[[\s\S]*?\]\)\);/,
  'const openRouterModelsToTry = [preferredModel];'
);

// Harden the Express boundary and allow the static frontend to call the API.
source = source.replace(
  'app.use(express.json());',
  `app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  const origin = req.get("Origin");
  const allowedOrigins = new Set([
    "https://thesisverse.dpdns.org",
    "https://thesis-verse-site.onrender.com",
    "https://thesis-verse.onrender.com",
    "http://localhost:5173",
    "http://localhost:3000",
  ]);

  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json({ limit: "1mb" }));`
);

fs.writeFileSync(outputPath, source);
console.log(`Prepared ${outputPath} from ${sourcePath}`);
