const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

if (API_BASE_URL && typeof window !== "undefined") {
  const originalFetch = window.fetch.bind(window);

  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === "string" && input.startsWith("/api/")) {
      input = `${API_BASE_URL}${input}`;
    } else if (input instanceof URL && input.pathname.startsWith("/api/")) {
      input = new URL(`${API_BASE_URL}${input.pathname}${input.search}`);
    } else if (input instanceof Request && new URL(input.url).pathname.startsWith("/api/")) {
      const requestUrl = new URL(input.url);
      requestUrl.href = `${API_BASE_URL}${requestUrl.pathname}${requestUrl.search}`;
      input = new Request(requestUrl.href, input);
    }

    return originalFetch(input, init);
  };
}
