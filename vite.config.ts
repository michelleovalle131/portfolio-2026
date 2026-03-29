import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const HERO_IMGS_VIRTUAL = "\0virtual:hero-imgs";
const FUN_FACTS_IMGS_VIRTUAL = "\0virtual:fun-facts-imgs";

function readPublicImgDir(publicSubdir: string, urlPrefix: string): string {
  const dir = path.join(__dirname, "public", publicSubdir);
  if (!fs.existsSync(dir)) {
    return "export default []";
  }
  const files = fs
    .readdirSync(dir)
    .filter((f: string) => /\.(png|jpe?g|webp|gif|svg)$/i.test(f));
  const urls = files.map(
    (f: string) => `${urlPrefix}/${encodeURIComponent(f)}`,
  );
  return `export default ${JSON.stringify(urls)}`;
}

/** Lists `public/imgs/hero-imgs/*` at build time for stamp backgrounds (public URLs, no bundling). */
function heroImgsPublicPlugin(): Plugin {
  return {
    name: "hero-imgs-public",
    resolveId(id) {
      if (id === "virtual:hero-imgs") {
        return HERO_IMGS_VIRTUAL;
      }
    },
    load(id) {
      if (id !== HERO_IMGS_VIRTUAL) {
        return null;
      }
      return readPublicImgDir("imgs/hero-imgs", "/imgs/hero-imgs");
    },
  };
}

/** Lists `public/imgs/fun-facts/*` for contact / split stamp stack. */
function funFactsImgsPublicPlugin(): Plugin {
  return {
    name: "fun-facts-imgs-public",
    resolveId(id) {
      if (id === "virtual:fun-facts-imgs") {
        return FUN_FACTS_IMGS_VIRTUAL;
      }
    },
    load(id) {
      if (id !== FUN_FACTS_IMGS_VIRTUAL) {
        return null;
      }
      return readPublicImgDir("imgs/fun-facts", "/imgs/fun-facts");
    },
  };
}

export default defineConfig({
  plugins: [react(), heroImgsPublicPlugin(), funFactsImgsPublicPlugin()],
});
