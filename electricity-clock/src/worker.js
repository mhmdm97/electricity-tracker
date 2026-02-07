// Minimal worker to serve assets
// This is required if the deployment is using 'wrangler deploy' and expects a worker entry point.
// If using Cloudflare Pages, this will be ignored.

export default {
  async fetch(request, env) {
    // If 'ASSETS' binding exists (from assets config), use it.
    if (env.ASSETS) {
      return await env.ASSETS.fetch(request);
    }

    // Fallback: Return 404 or index.html?
    // In a pure static setup, we shouldn't reach here without ASSETS.
    console.error("ASSETS binding not found!");
    return new Response("Not Found (ASSETS missing)", { status: 404 });
  }
};
