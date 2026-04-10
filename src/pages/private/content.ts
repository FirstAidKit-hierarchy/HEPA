export type WorkshopDetail = {
  label: string;
  value: string;
};

export type WorkshopAction = {
  label: string;
  href: string;
  pendingLabel: string;
  note: string;
};

export type WorkshopContent = {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  details: WorkshopDetail[];
  actions: {
    agenda: WorkshopAction;
    payment: WorkshopAction;
  };
  checklist: string[];
  updatedAt?: string;
};

const DEFAULT_WORKSHOP_CONTENT = {
  badge: "Workshop attendees",
  title: "Workshop access for May 1 and May 2, 2026",
  highlight: "agenda and seat confirmation",
  description:
    "This private page is for invited workshop attendees. Use it to review the agenda, complete the online payment, and confirm your seat before the workshop begins on May 1, 2026 and May 2, 2026.",
  details: [
    {
      label: "Who this page is for",
      value: "Confirmed invitees and workshop attendees only.",
    },
    {
      label: "What to do here",
      value: "Review the workshop agenda and complete payment to confirm your seat.",
    },
    {
      label: "Workshop dates",
      value: "Thursday, May 1, 2026 and Friday, May 2, 2026.",
    },
  ],
  actions: {
    agenda: {
      label: "Agenda PDF",
      href: "",
      pendingLabel: "Agenda will be added",
      note: "The workshop agenda will appear here once it has been published.",
    },
    payment: {
      label: "Confirm seat payment",
      href: "",
      pendingLabel: "Payment link will be added",
      note: "The online payment link will appear here once seat confirmation opens.",
    },
  },
  checklist: [
    "Open the workshop agenda and review the sessions for both days.",
    "Complete the online payment to confirm your seat.",
    "Keep this page bookmarked for updates until the workshop starts.",
  ],
} satisfies WorkshopContent;

const normalizeString = (value: unknown, fallback: string) => {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : fallback;
};

const normalizeDetails = (value: unknown) => {
  if (!Array.isArray(value)) {
    return DEFAULT_WORKSHOP_CONTENT.details.map((item) => ({ ...item }));
  }

  const details = value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      return {
        label: normalizeString((item as WorkshopDetail).label, ""),
        value: normalizeString((item as WorkshopDetail).value, ""),
      };
    })
    .filter((item): item is WorkshopDetail => Boolean(item && (item.label || item.value)));

  return details.length ? details : DEFAULT_WORKSHOP_CONTENT.details.map((item) => ({ ...item }));
};

const normalizeChecklist = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [...DEFAULT_WORKSHOP_CONTENT.checklist];
  }

  const checklist = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter((item) => item.length > 0);

  return checklist.length ? checklist : [...DEFAULT_WORKSHOP_CONTENT.checklist];
};

const normalizeAction = (value: unknown, fallback: WorkshopAction): WorkshopAction => {
  if (!value || typeof value !== "object") {
    return { ...fallback };
  }

  const action = value as Partial<WorkshopAction>;

  return {
    label: normalizeString(action.label, fallback.label),
    href: typeof action.href === "string" ? action.href.trim() : fallback.href,
    pendingLabel: normalizeString(action.pendingLabel, fallback.pendingLabel),
    note: normalizeString(action.note, fallback.note),
  };
};

export const workshopContent = DEFAULT_WORKSHOP_CONTENT;

export const createWorkshopContentDraft = (value: WorkshopContent = DEFAULT_WORKSHOP_CONTENT): WorkshopContent => ({
  badge: value.badge,
  title: value.title,
  highlight: value.highlight,
  description: value.description,
  details: value.details.map((item) => ({ ...item })),
  actions: {
    agenda: { ...value.actions.agenda },
    payment: { ...value.actions.payment },
  },
  checklist: [...value.checklist],
  updatedAt: value.updatedAt,
});

export const normalizeWorkshopContent = (value: unknown): WorkshopContent => {
  if (!value || typeof value !== "object") {
    return createWorkshopContentDraft(DEFAULT_WORKSHOP_CONTENT);
  }

  const content = value as Partial<WorkshopContent>;

  return {
    badge: normalizeString(content.badge, DEFAULT_WORKSHOP_CONTENT.badge),
    title: normalizeString(content.title, DEFAULT_WORKSHOP_CONTENT.title),
    highlight: normalizeString(content.highlight, DEFAULT_WORKSHOP_CONTENT.highlight),
    description: normalizeString(content.description, DEFAULT_WORKSHOP_CONTENT.description),
    details: normalizeDetails(content.details),
    actions: {
      agenda: normalizeAction(content.actions?.agenda, DEFAULT_WORKSHOP_CONTENT.actions.agenda),
      payment: normalizeAction(content.actions?.payment, DEFAULT_WORKSHOP_CONTENT.actions.payment),
    },
    checklist: normalizeChecklist(content.checklist),
    updatedAt: typeof content.updatedAt === "string" ? content.updatedAt : undefined,
  };
};
