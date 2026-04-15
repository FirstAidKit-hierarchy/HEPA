export type ContactFormValues = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

export const CONTACT_FORM_DRAFT_STORAGE_KEY = "hepa.contactFormDraft";

const normalizeString = (value: unknown) => (typeof value === "string" ? value.trim() : "");

const readEnvValue = (key: keyof HepaRuntimeEnv) => {
  const runtimeValue = typeof window !== "undefined" ? window.__HEPA_RUNTIME_CONFIG__?.[key] : undefined;
  const buildValue = import.meta.env[key];

  return normalizeString(runtimeValue || buildValue);
};

export const emptyContactFormValues: ContactFormValues = {
  firstName: "",
  lastName: "",
  company: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

export const isValidEmailAddress = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const normalizeContactFormValues = (value: unknown): ContactFormValues => {
  if (!value || typeof value !== "object") {
    return { ...emptyContactFormValues };
  }

  const source = value as Record<string, unknown>;

  return {
    firstName: normalizeString(source.firstName),
    lastName: normalizeString(source.lastName),
    company: normalizeString(source.company),
    email: normalizeString(source.email),
    phone: normalizeString(source.phone),
    service: normalizeString(source.service),
    message: normalizeString(source.message),
  };
};

export const getContactFormEmailApiUrl = () => {
  const contactFormEmailApiUrl = readEnvValue("VITE_CONTACT_FORM_EMAIL_API_URL").replace(/\/+$/, "");

  if (contactFormEmailApiUrl) {
    return contactFormEmailApiUrl;
  }

  return readEnvValue("VITE_ADMIN_REQUEST_EMAIL_API_URL").replace(/\/+$/, "");
};

export const loadContactFormDraft = (): ContactFormValues => {
  if (typeof window === "undefined") {
    return { ...emptyContactFormValues };
  }

  try {
    const storedValue = window.localStorage.getItem(CONTACT_FORM_DRAFT_STORAGE_KEY);

    if (!storedValue) {
      return { ...emptyContactFormValues };
    }

    return normalizeContactFormValues(JSON.parse(storedValue));
  } catch {
    return { ...emptyContactFormValues };
  }
};

export const saveContactFormDraft = (values: ContactFormValues) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CONTACT_FORM_DRAFT_STORAGE_KEY, JSON.stringify(normalizeContactFormValues(values)));
};

export const clearContactFormDraft = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(CONTACT_FORM_DRAFT_STORAGE_KEY);
};
