import { beforeEach, describe, expect, it, vi } from "vitest";

const firestoreMocks = vi.hoisted(() => {
  const collection = vi.fn((_firestore: unknown, name: string) => ({ kind: "collection", name }));
  const doc = vi.fn((_firestore: unknown, name: string, id: string) => ({ kind: "doc", name, id }));

  return {
    addDoc: vi.fn(),
    collection,
    deleteDoc: vi.fn(),
    doc,
    getDoc: vi.fn(),
    onSnapshot: vi.fn(),
    orderBy: vi.fn(),
    query: vi.fn(),
    setDoc: vi.fn(),
  };
});

vi.mock("@/lib/firebase/client", () => ({
  firestore: { kind: "firestore" },
}));

vi.mock("@/pages/admin/config", () => ({
  ADMIN_PAGE_PATH: "/admin",
}));

vi.mock("firebase/firestore", () => firestoreMocks);

const buildRequestSnapshot = (status: "pending" | "approved" | "declined") => ({
  exists: () => true,
  id: "uid-1",
  data: () => ({
    uid: "uid-1",
    email: "requester@example.com",
    displayName: "Requester",
    status,
    requestedAt: "2026-04-14T10:00:00.000Z",
    reviewedAt: status === "pending" ? "" : "2026-04-14T11:00:00.000Z",
    reviewedByUid: status === "pending" ? "" : "owner-1",
    reviewedByEmail: status === "pending" ? "" : "owner@example.com",
    ownerEmail: "owner@example.com",
  }),
});

const buildRequestSnapshotWithOwner = (status: "pending" | "approved" | "declined", ownerEmail: string) => ({
  exists: () => true,
  id: "uid-1",
  data: () => ({
    uid: "uid-1",
    email: "requester@example.com",
    displayName: "Requester",
    status,
    requestedAt: "2026-04-14T10:00:00.000Z",
    reviewedAt: status === "pending" ? "" : "2026-04-14T11:00:00.000Z",
    reviewedByUid: status === "pending" ? "" : "owner-1",
    reviewedByEmail: status === "pending" ? "" : "owner@example.com",
    ownerEmail,
  }),
});

describe("submitAdminAccessRequest", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    window.__HEPA_RUNTIME_CONFIG__ = {
      VITE_ADMIN_OWNER_EMAIL: "owner@example.com",
    };
  });

  it("creates a fresh pending request and owner email job when no request exists", async () => {
    firestoreMocks.getDoc.mockResolvedValue({
      exists: () => false,
    });
    firestoreMocks.setDoc.mockResolvedValue(undefined);
    firestoreMocks.addDoc.mockResolvedValue(undefined);

    const { submitAdminAccessRequest } = await import("@/lib/firebase/adminRequests");
    const result = await submitAdminAccessRequest({
      uid: "uid-1",
      email: "Requester@Example.com",
      displayName: "Requester",
    } as never);

    expect(result.request.status).toBe("pending");
    expect(result.request.email).toBe("requester@example.com");
    expect(result.request.ownerEmail).toBe("owner@example.com");
    expect(result.emailQueued).toBe(true);
    expect(result.reusedPendingRequest).toBeUndefined();
    expect(result.resubmittedReviewedRequest).toBe(false);
    expect(firestoreMocks.setDoc).toHaveBeenCalledTimes(1);
    expect(firestoreMocks.addDoc).toHaveBeenCalledTimes(1);
    expect(firestoreMocks.addDoc.mock.calls[0][1]).toMatchObject({
      to: "owner@example.com",
      adminNotificationType: "admin-access-request-submitted",
      relatedRequestUid: "uid-1",
    });
  });

  it("keeps an existing pending request and queues the owner notification again", async () => {
    firestoreMocks.getDoc.mockResolvedValue(buildRequestSnapshot("pending"));
    firestoreMocks.addDoc.mockResolvedValue(undefined);

    const { submitAdminAccessRequest } = await import("@/lib/firebase/adminRequests");
    const result = await submitAdminAccessRequest({
      uid: "uid-1",
      email: "requester@example.com",
      displayName: "Requester",
    } as never);

    expect(result.request.status).toBe("pending");
    expect(result.emailQueued).toBe(true);
    expect(result.reusedPendingRequest).toBe(true);
    expect(result.resubmittedReviewedRequest).toBeUndefined();
    expect(firestoreMocks.setDoc).not.toHaveBeenCalled();
    expect(firestoreMocks.addDoc).toHaveBeenCalledTimes(1);
    expect(firestoreMocks.addDoc.mock.calls[0][1]).toMatchObject({
      to: "owner@example.com",
      adminNotificationType: "admin-access-request-submitted",
      relatedRequestUid: "uid-1",
    });
  });

  it.each(["declined", "approved"] as const)(
    "resubmits a %s request by overwriting the record back to pending and queuing owner email",
    async (status) => {
      firestoreMocks.getDoc.mockResolvedValue(buildRequestSnapshot(status));
      firestoreMocks.setDoc.mockResolvedValue(undefined);
      firestoreMocks.addDoc.mockResolvedValue(undefined);

      const { submitAdminAccessRequest } = await import("@/lib/firebase/adminRequests");
      const result = await submitAdminAccessRequest({
        uid: "uid-1",
        email: "Requester@Example.com",
        displayName: "Requester",
      } as never);

      expect(result.request.status).toBe("pending");
      expect(result.request.email).toBe("requester@example.com");
      expect(result.request.ownerEmail).toBe("owner@example.com");
      expect(result.request.reviewedAt).toBe("");
      expect(result.request.reviewedByUid).toBe("");
      expect(result.request.reviewedByEmail).toBe("");
      expect(result.emailQueued).toBe(true);
      expect(result.reusedPendingRequest).toBeUndefined();
      expect(result.resubmittedReviewedRequest).toBe(true);
      expect(firestoreMocks.setDoc).toHaveBeenCalledTimes(1);
      expect(firestoreMocks.setDoc.mock.calls[0][1]).toMatchObject({
        uid: "uid-1",
        email: "requester@example.com",
        displayName: "Requester",
        status: "pending",
        reviewedAt: "",
        reviewedByUid: "",
        reviewedByEmail: "",
        ownerEmail: "owner@example.com",
      });
      expect(firestoreMocks.setDoc.mock.calls[0][1]).toEqual(
        expect.objectContaining({
          requestedAt: expect.any(String),
        }),
      );
      expect(firestoreMocks.addDoc).toHaveBeenCalledTimes(1);
      expect(firestoreMocks.addDoc.mock.calls[0][1]).toMatchObject({
        to: "owner@example.com",
        adminNotificationType: "admin-access-request-submitted",
        relatedRequestUid: "uid-1",
      });
    },
  );

  it("reuses the stored owner email when resubmitting a reviewed request", async () => {
    window.__HEPA_RUNTIME_CONFIG__ = {
      VITE_ADMIN_OWNER_EMAIL: "",
    };
    firestoreMocks.getDoc.mockResolvedValue(buildRequestSnapshotWithOwner("declined", "saved-owner@example.com"));
    firestoreMocks.setDoc.mockResolvedValue(undefined);
    firestoreMocks.addDoc.mockResolvedValue(undefined);

    const { submitAdminAccessRequest } = await import("@/lib/firebase/adminRequests");
    const result = await submitAdminAccessRequest({
      uid: "uid-1",
      email: "Requester@Example.com",
      displayName: "Requester",
    } as never);

    expect(result.request.ownerEmail).toBe("saved-owner@example.com");
    expect(firestoreMocks.setDoc.mock.calls[0][1]).toMatchObject({
      ownerEmail: "saved-owner@example.com",
    });
    expect(firestoreMocks.addDoc.mock.calls[0][1]).toMatchObject({
      to: "saved-owner@example.com",
    });
  });
});
