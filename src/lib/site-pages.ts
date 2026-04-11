const ABSOLUTE_SCHEME_PATTERN = /^[a-z][a-z\d+\-.]*:/i;

export const isHashHref = (value: string) => value.trim().startsWith("#");

export const isExternalHref = (value: string) => {
  const trimmed = value.trim();

  return trimmed.startsWith("//") || ABSOLUTE_SCHEME_PATTERN.test(trimmed);
};

export const isInternalPathHref = (value: string) => {
  const trimmed = value.trim();

  return trimmed.startsWith("/") && !trimmed.startsWith("//");
};

export const normalizePagePath = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return "/";
  }

  let pathValue = trimmed;

  if (isExternalHref(pathValue)) {
    try {
      const parsedUrl = new URL(pathValue);
      pathValue = parsedUrl.pathname || "/";
    } catch {
      return "/";
    }
  }

  if (isHashHref(pathValue)) {
    return "/";
  }

  pathValue = pathValue.replace(/\\/g, "/");
  pathValue = pathValue.split(/[?#]/, 1)[0] ?? pathValue;
  pathValue = pathValue.replace(/\s+/g, "-");

  if (!pathValue.startsWith("/")) {
    pathValue = `/${pathValue}`;
  }

  pathValue = pathValue.replace(/\/{2,}/g, "/");

  if (pathValue.length > 1) {
    pathValue = pathValue.replace(/\/+$/, "");
  }

  return pathValue.toLowerCase() || "/";
};

export const normalizeOptionalPagePath = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  return normalizePagePath(trimmed);
};

export const normalizeAppHref = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed || isHashHref(trimmed) || !isInternalPathHref(trimmed)) {
    return trimmed;
  }

  const [pathWithQuery, hashFragment] = trimmed.split("#");
  const [pathname, searchFragment] = pathWithQuery.split("?");
  const normalizedPath = normalizePagePath(pathname);

  return `${normalizedPath}${searchFragment ? `?${searchFragment}` : ""}${hashFragment ? `#${hashFragment}` : ""}`;
};

export const pagePathsMatch = (left: string, right: string) => normalizePagePath(left) === normalizePagePath(right);
