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
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }

  // Vimeo
  if (url.includes("vimeo.com")) {
    const id = url.split("vimeo.com/")[1]?.split("?")[0];
    return id ? `https://player.vimeo.com/video/${id}` : null;
  }

  return null;
}

