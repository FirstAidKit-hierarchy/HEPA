import { describe, expect, it } from "vitest";
import { normalizeSiteContent } from "@/content/site/defaults";
import { normalizeAppHref, normalizeOptionalPagePath, normalizePagePath, pagePathsMatch } from "@/lib/site-pages";

describe("site page helpers", () => {
  it("normalizes editable page paths", () => {
    expect(normalizePagePath(" About Us/ ")).toBe("/about-us");
    expect(normalizePagePath("https://example.com/Programs/Workshop/")).toBe("/programs/workshop");
    expect(normalizePagePath("#contact")).toBe("/");
  });

  it("normalizes internal hrefs while preserving query and hash fragments", () => {
    expect(normalizeAppHref("/About/?tab=overview#contact")).toBe("/about?tab=overview#contact");
  });

  it("matches equivalent route paths", () => {
    expect(pagePathsMatch("/services/access", "/services/access/")).toBe(true);
  });

  it("keeps optional paths empty until the user sets them", () => {
    expect(normalizeOptionalPagePath("   ")).toBe("");
    expect(normalizeOptionalPagePath(" Admin Portal/ ")).toBe("/admin-portal");
  });
});

describe("site content normalization", () => {
  it("hydrates custom pages with route-safe paths and block defaults", () => {
    const content = normalizeSiteContent({
      customPages: [
        {
          title: "Programs",
          navigationLabel: "Programs",
          path: "https://example.com/Programs/Workshop/",
          description: "Workshop detail page",
          blocks: [
            {
              type: "cta",
              title: "Reserve a seat",
            },
          ],
        },
      ],
    });

    expect(content.customPages).toHaveLength(1);
    expect(content.customPages[0].path).toBe("/programs/workshop");
    expect(content.customPages[0].blocks[0].type).toBe("cta");
    expect(content.customPages[0].blocks[0].primaryAction.label).toBe("Get in touch");
  });

  it("normalizes the optional 404 alias path", () => {
    const content = normalizeSiteContent({
      notFoundPageRoute: {
        aliasPath: " Preview Missing/ ",
      },
    });

    expect(content.notFoundPageRoute.aliasPath).toBe("/preview-missing");
  });
});
