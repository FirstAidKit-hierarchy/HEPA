import { normalizePagePath } from "@/lib/site-pages";

export const ADMIN_PAGE_PATH = normalizePagePath(import.meta.env.VITE_ADMIN_PATH || "/admin");
export const ADMIN_PAGE_TITLE = "HEPA Administration";
export const ADMIN_PAGE_ROBOTS = "noindex,nofollow,noarchive,nosnippet";
