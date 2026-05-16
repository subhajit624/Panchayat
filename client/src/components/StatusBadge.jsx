const statusText = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  "in-progress": "In progress",
  completed: "Completed",
  confirmed: "Confirmed",
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
  important: "Important",
  normal: "Normal",
  available: "Available",
  busy: "Busy",
  offline: "Offline",
  blocked: "Blocked",
};

export const StatusBadge = ({ value }) => (
  <span className="inline-flex items-center rounded-full border border-neutral-300 bg-white px-2.5 py-1 text-xs font-semibold text-neutral-800">
    {statusText[value] || value || "Unknown"}
  </span>
);
