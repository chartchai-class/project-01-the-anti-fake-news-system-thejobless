export const config = { runtime: "edge" };

function unauthorized() {
  return new Response("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Protected"' }
  });
}

export default async function handler(req) {
  const user = process.env.BASIC_AUTH_USER || "user";
  const pass = process.env.BASIC_AUTH_PASS || "pass";

  const auth = req.headers.get("authorization") || "";
  const ok = auth.startsWith("Basic ")
    && (() => {
         try {
           const [u, p] = atob(auth.replace("Basic ", "")).split(":");
           return u === user && p === pass;
         } catch { return false; }
       })();

  if (!ok) return unauthorized();

  const url = new URL(req.url);
  const target = "/" + (url.searchParams.get("path") || "");
  // Proxy through to the original target; keep method/headers/body
  const proxied = await fetch(new Request(new URL(target, url.origin), req));

  // SPA fallback if html requested and 404
  if (proxied.status === 404 && (req.headers.get("accept") || "").includes("text/html")) {
    return fetch(new URL("/index.html", url.origin));
  }
  return proxied;
}
