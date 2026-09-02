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
