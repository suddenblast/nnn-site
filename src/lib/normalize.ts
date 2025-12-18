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
