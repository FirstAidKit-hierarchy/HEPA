import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONTACT_FORM_DRAFT_STORAGE_KEY,
  clearContactFormDraft,
  emptyContactFormValues,
  getContactFormEmailApiUrl,
  isValidEmailAddress,
  loadContactFormDraft,
  saveContactFormDraft,
} from "@/lib/contact-form";

describe("contact form helpers", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.__HEPA_RUNTIME_CONFIG__ = undefined;
    vi.unstubAllEnvs();
  });

  it("prefers the dedicated contact form API URL and trims trailing slashes", () => {
    vi.stubEnv("VITE_CONTACT_FORM_EMAIL_API_URL", "https://contact.hepa.sa///");
    vi.stubEnv("VITE_ADMIN_REQUEST_EMAIL_API_URL", "https://admin.hepa.sa");

    expect(getContactFormEmailApiUrl()).toBe("https://contact.hepa.sa");
  });

  it("falls back to the admin request email API URL", () => {
    vi.stubEnv("VITE_CONTACT_FORM_EMAIL_API_URL", "");
    vi.stubEnv("VITE_ADMIN_REQUEST_EMAIL_API_URL", "https://admin.hepa.sa/");

    expect(getContactFormEmailApiUrl()).toBe("https://admin.hepa.sa");
  });

  it("restores runtime config values before build-time values", () => {
    vi.stubEnv("VITE_CONTACT_FORM_EMAIL_API_URL", "https://build.hepa.sa");
    window.__HEPA_RUNTIME_CONFIG__ = {
      VITE_CONTACT_FORM_EMAIL_API_URL: "https://runtime.hepa.sa/",
    };

    expect(getContactFormEmailApiUrl()).toBe("https://runtime.hepa.sa");
  });

  it("saves and restores contact form drafts from local storage", () => {
    saveContactFormDraft({
      firstName: "Abdulrahman",
      lastName: "H",
      company: "HEPA",
      email: "hello@example.com",
      phone: "123",
      service: "Evidence Generation",
      message: "Need a benchmark.",
    });

    expect(loadContactFormDraft()).toEqual({
      firstName: "Abdulrahman",
      lastName: "H",
      company: "HEPA",
      email: "hello@example.com",
      phone: "123",
      service: "Evidence Generation",
      message: "Need a benchmark.",
    });
  });

  it("clears the saved draft", () => {
    window.localStorage.setItem(CONTACT_FORM_DRAFT_STORAGE_KEY, JSON.stringify({ firstName: "A" }));

    clearContactFormDraft();

    expect(loadContactFormDraft()).toEqual(emptyContactFormValues);
  });

  it("validates email addresses", () => {
    expect(isValidEmailAddress("team@hepa.sa")).toBe(true);
    expect(isValidEmailAddress("not-an-email")).toBe(false);
  });
});
