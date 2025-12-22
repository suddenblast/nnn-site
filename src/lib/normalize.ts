import { STRAPI_ORIGIN } from "./strapi";

// Normalize Strapi entries (supports { id, attributes } and top-level fields)
export const norm = (item: any) => {
  if (!item) return item;
  return item?.attributes ? { ...item.attributes, id: item.id } : item;
};

// Media helpers
export const imageUrl = (img: any): string | null => {
  if (!img) return null;

  return (
    img?.url ??
    img?.attributes?.url ??
    img?.data?.attributes?.url ??
    img?.data?.url ??
    null
  );
};

export const imageAlt = (img: any, fallback = ""): string => {
  return (
    img?.alternativeText ??
    img?.attributes?.alternativeText ??
    img?.data?.attributes?.alternativeText ??
    fallback
  );
};

export const absoluteMediaUrl = (src?: string | null): string | null => {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  if (src.startsWith("/")) return `${STRAPI_ORIGIN}${src}`;
  return src;
};

export const sectionLabel = (section: any): string => {
  if (!section) return "";
  if (typeof section === "string") return section;

  return (
    section?.name ??
    section?.title ??
    section?.label ??
    section?.value ??
    section?.data?.attributes?.name ??
    section?.data?.attributes?.title ??
    ""
  );
};

// Role → readable text (prevents [object Object])
export const roleText = (role: any): string => {
  if (!role) return "";
  if (typeof role === "string") return role;

  if (typeof role === "object") {
    if (typeof role.name === "string") return role.name;
    if (typeof role.title === "string") return role.title;
    if (typeof role.label === "string") return role.label;
    if (typeof role.value === "string") return role.value;

    // Relation wrapper
    if (role.data) {
      const d = role.data;
      if (Array.isArray(d)) {
        const first = norm(d[0]);
        return (
          first?.name ??
          first?.title ??
          first?.label ??
          ""
        );
      }
      const one = norm(d);
      return (
        one?.name ??
        one?.title ??
        one?.label ??
        ""
      );
    }
  }

  return "";
};

// Rich text / blocks → plain text (for index pages, previews)
export const plainText = (value: any): string => {
  if (!value) return "";
  if (typeof value === "string") return value;

  // Strapi blocks (array of { children: [{ text }] })
  if (Array.isArray(value)) {
    const parts: string[] = [];

    for (const block of value) {
      const children = block?.children;
      if (Array.isArray(children)) {
        for (const c of children) {
          if (typeof c?.text === "string") parts.push(c.text);
        }
      }
    }

    return parts.join(" ").replace(/\s+/g, " ").trim();
  }

  return "";
};

// Staff byline from staff relation
export const staffByline = (staff: any): string => {
  if (!staff) return "";
  const list = staffToList(staff)
    .map((x: any) => (x?.attributes ? x.attributes : x))
    .filter(Boolean)
    .map((p: any) => {
      const name = p?.name ?? "";
      const role = p?.role ?? "";
      if (name && role) return `${name} • ${role}`;
      return name || role || "";
    })
    .filter(Boolean);

  if (!list.length) return "";
  return `By ${list.join(", ")}`;
};

// Helper for staffToList
const staffToList = (staff: any): any[] => {
  if (!staff) return [];
  if (Array.isArray(staff)) return staff;
  if (staff?.data) return Array.isArray(staff.data) ? staff.data : [staff.data];
  return [staff];
};
