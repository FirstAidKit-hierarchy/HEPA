import { writeFile, copyFile } from "node:fs/promises";
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

const isNodeModule = (id: string) => id.includes("node_modules");
const hasPackage = (id: string, pkg: string) =>
  id.includes(`/node_modules/${pkg}/`) || id.includes(`\\node_modules\\${pkg}\\`);

const normalizeBasePath = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return "/";
  }

  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
};

const resolvePagesBase = (mode: string) => {
  const env = loadEnv(mode, process.cwd(), "");
  const explicitBase = env.VITE_BASE_PATH?.trim();

  if (explicitBase) {
    return normalizeBasePath(explicitBase);
  }

  const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1]?.trim();

  if (process.env.GITHUB_ACTIONS === "true" && repositoryName) {
    return normalizeBasePath(repositoryName);
  }

  return "/";
};

const githubPagesSpaFallback = (): Plugin => ({
  name: "github-pages-spa-fallback",
  apply: "build",
  async closeBundle() {
    const distDir = path.resolve(__dirname, "dist");
    const indexPath = path.join(distDir, "index.html");

    await copyFile(indexPath, path.join(distDir, "404.html"));
    await writeFile(path.join(distDir, ".nojekyll"), "");
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: resolvePagesBase(mode),
  server: {
    host: "::",
    port: 8080,
    allowedHosts: true,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), githubPagesSpaFallback()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!isNodeModule(id)) {
            return undefined;
          }

          if (hasPackage(id, "firebase")) {
            return "firebase";
          }

          if (
            hasPackage(id, "react") ||
            hasPackage(id, "react-dom") ||
            hasPackage(id, "react-router-dom") ||
            hasPackage(id, "@tanstack/react-query") ||
            hasPackage(id, "@tanstack/query-core")
          ) {
            return "react-vendor";
          }

          if (
            id.includes("@radix-ui") ||
            hasPackage(id, "lucide-react") ||
            hasPackage(id, "sonner") ||
            hasPackage(id, "class-variance-authority") ||
            hasPackage(id, "clsx") ||
            hasPackage(id, "tailwind-merge")
          ) {
            return "ui-vendor";
          }

          return undefined;
        },
      },
    },
  },
}));
