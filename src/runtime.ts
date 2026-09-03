// Small production runtime guard for stale Vite chunks after a deployment.
// Vite can emit vite:preloadError when an older tab requests a chunk that
// no longer exists in the newest deployment. Reload once so the browser can
// receive the current index.html and hashed assets.
let hasReloadedForChunkError = false;

window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  if (hasReloadedForChunkError) return;
  hasReloadedForChunkError = true;
  window.location.reload();
});

// The frontend can be deployed independently as a Render Static Site while
// the Express API remains on the existing Render Web Service. Keep API calls
// written as /api/... throughout the app and transparently route them to the
// configured backend origin when one is provided at Vite build time.
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

if (apiBaseUrl) {
  const originalFetch = window.fetch.bind(window);

  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === "string" && input.startsWith("/api/")) {
      input = `${apiBaseUrl}${input}`;
    } else if (input instanceof URL && input.pathname.startsWith("/api/")) {
      input = new URL(`${apiBaseUrl}${input.pathname}${input.search}`);
    } else if (input instanceof Request && new URL(input.url).pathname.startsWith("/api/")) {
      const requestUrl = new URL(input.url);
      requestUrl.href = `${apiBaseUrl}${requestUrl.pathname}${requestUrl.search}`;
      input = new Request(requestUrl.href, input);
    }

    return originalFetch(input, init);
  };
}
