import fs from "node:fs";

const sourcePath = "server.ts";
const outputPath = ".generated-server.ts";

let source = fs.readFileSync(sourcePath, "utf8");

// Production port: Render and similar hosts provide PORT at runtime.
source = source.replace(
  'const PORT = 3000;',
  'const PORT = Number(process.env.PORT) || 3000;'
);

// Remove the obsolete demo OAuth endpoints. Authentication is handled by Firebase in the client.
source = source.replace(
  /\/\/ OAuth Auth URL Endpoint[\s\S]*?\/\/ Health Check/,
  '// Production authentication is handled by Firebase Auth on the client.\n\n// Health Check'
);

// Replace legacy hard-coded production URL references.
source = source.replaceAll("https://thesisverse.org", "https://thesisverse.dpdns.org");

// Harden the Express boundary without adding another dependency.
source = source.replace(
  'app.use(express.json());',
  `app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

app.use(express.json({ limit: "1mb" }));`
);

fs.writeFileSync(outputPath, source);
console.log(`Prepared ${outputPath} from ${sourcePath}`);
