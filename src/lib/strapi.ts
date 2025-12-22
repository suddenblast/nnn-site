// src/lib/strapi.ts

const STRAPI_URL =
  import.meta.env.PUBLIC_STRAPI_URL ??
  import.meta.env.STRAPI_URL ??
  "http://localhost:1337";

export const STRAPI_ORIGIN = STRAPI_URL;

// Minimal, robust query serializer that preserves bracketed keys like:
// populate[0]=series, filters[slug][$eq]=..., pagination[pageSize]=...
function serializeQuery(obj: Record<string, any>, prefix = ""): string[] {
  const out: string[] = [];

  for (const [rawKey, value] of Object.entries(obj || {})) {
    if (value === undefined || value === null) continue;

    // If the caller already provided bracketed keys, keep them verbatim.
    // Example: key = "populate[0]" should not become "populate%5B0%5D" as a *key string* is fine,
    // but must remain exactly that when encoded.
    const key = prefix ? `${prefix}[${rawKey}]` : rawKey;

    if (Array.isArray(value)) {
      // For arrays, use indexed brackets: key[0]=..., key[1]=...
      value.forEach((v, i) => {
        if (v === undefined || v === null) return;
        if (typeof v === "object" && !Array.isArray(v)) {
          out.push(...serializeQuery(v, `${key}[${i}]`));
        } else {
          out.push(`${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(String(v))}`);
        }
      });
    } else if (typeof value === "object") {
      // Nested object: recurse
      out.push(...serializeQuery(value, key));
    } else {
      // Primitive
      out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
  }

  return out;
}

export async function strapiGet(path: string, query: Record<string, any> = {}) {
  const base = path.startsWith("http") ? path : `${STRAPI_URL}${path}`;
  const qsParts = serializeQuery(query);
  const url = qsParts.length ? `${base}?${qsParts.join("&")}` : base;

  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Strapi request failed ${res.status}: ${url}\n${text}`);
  }

  return res.json();
}
