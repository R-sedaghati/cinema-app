import type { UserCreateArtistRequest } from "@/lib/services/landing/type";

/**
 * A filled form waiting on the yearly subscription payment. The form is only saved once
 * the payment settles, so the answers ride out to the gateway and back in localStorage.
 *
 * ponytail: browser-only — switching device after paying means refilling the form (it
 * then submits for free, the subscription is already active). Server drafts if that bites.
 */
export type SubscriptionDraft = { editId: number | null } & UserCreateArtistRequest;

const KEY = "subscription-draft";

// Storage can throw (private mode, blocked site data); a lost draft only costs a refill.
export const saveSubscriptionDraft = (draft: SubscriptionDraft) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(draft));
  } catch {}
};

export const loadSubscriptionDraft = (): SubscriptionDraft | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as SubscriptionDraft) : null;
  } catch {
    return null;
  }
};

export const clearSubscriptionDraft = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {}
};
