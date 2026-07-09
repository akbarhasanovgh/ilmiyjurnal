// Client-side workflow labels, colors, and allowed-transition matrix.
// Mirrors the server-side transition_submission() authorization matrix.
// The SERVER is the source of truth — this only powers UI copy and disabled states.

export type WorkflowState =
  | "draft"
  | "submitted"
  | "screening"
  | "editor_assigned"
  | "under_review"
  | "revision_requested"
  | "revised"
  | "accepted"
  | "rejected"
  | "withdrawn";

export const STATE_LABEL_UZ: Record<WorkflowState, string> = {
  draft: "Qoralama",
  submitted: "Topshirilgan",
  screening: "Dastlabki ko‘rik",
  editor_assigned: "Muharrir tayinlangan",
  under_review: "Taqriz jarayonida",
  revision_requested: "Qayta ishlash so‘ralgan",
  revised: "Qayta ishlangan",
  accepted: "Qabul qilingan",
  rejected: "Rad etilgan",
  withdrawn: "Chaqirib olingan",
};

export const STATE_TOKEN: Record<WorkflowState, string> = {
  draft: "state-draft",
  submitted: "state-submitted",
  screening: "state-screening",
  editor_assigned: "state-editor-assigned",
  under_review: "state-under-review",
  revision_requested: "state-revision-requested",
  revised: "state-revised",
  accepted: "state-accepted",
  rejected: "state-rejected",
  withdrawn: "state-withdrawn",
};

export type ActorRole = "owner" | "assigned_editor" | "managing" | "admin" | "super";

export interface TransitionSpec {
  to: WorkflowState;
  requires: "OWNER" | "ASSIGNED_EDITOR" | string; // permission key
  label: string;
  tone?: "primary" | "destructive" | "default";
  reasonRequired?: boolean;
}

// Which transitions are valid FROM a given state.
export const TRANSITIONS: Record<WorkflowState, TransitionSpec[]> = {
  draft: [
    { to: "submitted", requires: "OWNER", label: "Tahririyatga topshirish", tone: "primary" },
    { to: "withdrawn", requires: "OWNER", label: "Qoralamani bekor qilish", tone: "destructive" },
  ],
  submitted: [
    { to: "screening", requires: "submissions.screen", label: "Ko‘rikka olish" },
    { to: "editor_assigned", requires: "submissions.assign_editor", label: "Muharrir tayinlash", tone: "primary" },
    { to: "rejected", requires: "submissions.decide", label: "Rad etish", tone: "destructive", reasonRequired: true },
    { to: "withdrawn", requires: "OWNER", label: "Chaqirib olish", tone: "destructive" },
  ],
  screening: [
    { to: "editor_assigned", requires: "submissions.assign_editor", label: "Muharrir tayinlash", tone: "primary" },
    { to: "rejected", requires: "submissions.decide", label: "Rad etish", tone: "destructive", reasonRequired: true },
  ],
  editor_assigned: [
    { to: "under_review", requires: "ASSIGNED_EDITOR", label: "Taqrizga o‘tkazish", tone: "primary" },
    { to: "rejected", requires: "submissions.decide", label: "Rad etish", tone: "destructive", reasonRequired: true },
  ],
  under_review: [
    { to: "revision_requested", requires: "ASSIGNED_EDITOR", label: "Qayta ishlash so‘rash", reasonRequired: true },
    { to: "accepted", requires: "ASSIGNED_EDITOR", label: "Qabul qilish", tone: "primary" },
    { to: "rejected", requires: "submissions.decide", label: "Rad etish", tone: "destructive", reasonRequired: true },
  ],
  revision_requested: [
    { to: "revised", requires: "OWNER", label: "Qayta ishlangan versiyani yuborish", tone: "primary" },
  ],
  revised: [
    { to: "under_review", requires: "ASSIGNED_EDITOR", label: "Yana taqrizga", tone: "primary" },
    { to: "accepted", requires: "ASSIGNED_EDITOR", label: "Qabul qilish", tone: "primary" },
    { to: "rejected", requires: "submissions.decide", label: "Rad etish", tone: "destructive", reasonRequired: true },
  ],
  accepted: [],
  rejected: [],
  withdrawn: [],
};

export function isTerminal(s: WorkflowState) {
  return s === "accepted" || s === "rejected" || s === "withdrawn";
}
