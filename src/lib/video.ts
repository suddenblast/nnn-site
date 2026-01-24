export function getYouTubeId(url?: string): string | null {
  if (!url) return null;

  // youtu.be/ID
  const short = url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
  if (short?.[1]) return short[1];

  // youtube.com/watch?v=ID
  const v = url.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
  if (v?.[1]) return v[1];

  // youtube.com/embed/ID
  const embed = url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/);
  if (embed?.[1]) return embed[1];

  return null;
}

function parseTimeToSeconds(raw: string | null): number | null {
  if (!raw) return null;

  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (/^\d+$/.test(trimmed)) return Number.parseInt(trimmed, 10);

  // 1h2m3s / 2m10s / 45s
  const hasHms = /\d+[hms]/i.test(trimmed);
  if (hasHms) {
    const h = trimmed.match(/(\d+)h/i)?.[1];
    const m = trimmed.match(/(\d+)m/i)?.[1];
    const s = trimmed.match(/(\d+)s/i)?.[1];
    const total =
      (h ? Number.parseInt(h, 10) * 3600 : 0) +
      (m ? Number.parseInt(m, 10) * 60 : 0) +
      (s ? Number.parseInt(s, 10) : 0);
    return Number.isFinite(total) && total > 0 ? total : null;
  }

  // 1:02:03 or 2:03
  if (trimmed.includes(":")) {
    const parts = trimmed.split(":").map((p) => Number.parseInt(p, 10));
    if (parts.some((n) => Number.isNaN(n))) return null;
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
  }

  return null;
}

function getStartSeconds(url: string): number | null {
  try {
    const parsed = new URL(url);
    const t = parsed.searchParams.get("t") ?? parsed.searchParams.get("start");
    const hashT = parsed.hash?.startsWith("#t=")
      ? parsed.hash.slice(3)
      : null;
    return parseTimeToSeconds(t) ?? parseTimeToSeconds(hashT);
  } catch {
    const match = url.match(/[?&#](?:t|start)=([^&#]+)/i);
    return parseTimeToSeconds(match?.[1] ?? null);
  }
}

export function getYouTubeThumb(url?: string, quality: "hq" | "mq" | "sd" = "hq"): string | null {
  const id = getYouTubeId(url);
  if (!id) return null;

  // Common options:
  // maxresdefault.jpg (sometimes missing), hqdefault.jpg (reliable)
  const file =
    quality === "sd" ? "sddefault.jpg" :
    quality === "mq" ? "mqdefault.jpg" :
    "hqdefault.jpg";

  return `https://i.ytimg.com/vi/${id}/${file}`;
}

export function toEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  // YouTube
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const id = getYouTubeId(url);
    if (!id) return null;
    const start = getStartSeconds(url);
    return start
      ? `https://www.youtube.com/embed/${id}?start=${start}`
      : `https://www.youtube.com/embed/${id}`;
  }

  // Vimeo
  if (url.includes("vimeo.com")) {
    const id = url.split("vimeo.com/")[1]?.split("?")[0];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }

  return null;
}
