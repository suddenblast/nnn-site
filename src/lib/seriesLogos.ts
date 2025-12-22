import fs from "node:fs";
import { fileURLToPath } from "node:url";

const logoFile = (filename: string): string | null => {
  const url = new URL(`../../public/logos/${filename}`, import.meta.url);
  return fs.existsSync(fileURLToPath(url)) ? `/logos/${filename}` : null;
};

export const seriesLogos: Record<string, { src: string | null; alt: string }> = {
  nnr: { src: logoFile("nnr-logo.svg"), alt: "Northwestern News Report" },
  nnx: { src: logoFile("nnx-logo.svg"), alt: "NNX" },
};
