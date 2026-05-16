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

const statusStyles = {
  pending:
    "border-amber-400/25 bg-amber-500/10 text-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.15)]",

  approved:
    "border-emerald-400/25 bg-emerald-500/10 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.15)]",

  completed:
    "border-emerald-400/25 bg-emerald-500/10 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.15)]",

  confirmed:
    "border-cyan-400/25 bg-cyan-500/10 text-cyan-300 shadow-[0_0_18px_rgba(6,182,212,0.15)]",

  rejected:
    "border-rose-400/25 bg-rose-500/10 text-rose-300 shadow-[0_0_18px_rgba(244,63,94,0.15)]",

  blocked:
    "border-rose-400/25 bg-rose-500/10 text-rose-300 shadow-[0_0_18px_rgba(244,63,94,0.15)]",

  "in-progress":
    "border-indigo-400/25 bg-indigo-500/10 text-indigo-300 shadow-[0_0_18px_rgba(99,102,241,0.15)]",

  urgent:
    "border-red-400/25 bg-red-500/10 text-red-300 shadow-[0_0_18px_rgba(239,68,68,0.18)]",

  high:
    "border-orange-400/25 bg-orange-500/10 text-orange-300 shadow-[0_0_18px_rgba(249,115,22,0.15)]",

  medium:
    "border-yellow-400/25 bg-yellow-500/10 text-yellow-300 shadow-[0_0_18px_rgba(234,179,8,0.15)]",

  low:
    "border-slate-400/25 bg-slate-500/10 text-slate-300 shadow-[0_0_18px_rgba(148,163,184,0.12)]",

  important:
    "border-fuchsia-400/25 bg-fuchsia-500/10 text-fuchsia-300 shadow-[0_0_18px_rgba(217,70,239,0.15)]",

  normal:
    "border-neutral-400/20 bg-white/5 text-neutral-300",

  available:
    "border-emerald-400/25 bg-emerald-500/10 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.15)]",

  busy:
    "border-orange-400/25 bg-orange-500/10 text-orange-300 shadow-[0_0_18px_rgba(249,115,22,0.15)]",

  offline:
    "border-neutral-400/20 bg-white/5 text-neutral-400",
};

export const StatusBadge = ({ value }) => (
  <>
    <style>{`
      @keyframes sb-pulse {
        0%,100% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.03);
        }
      }

      .sb-badge {
        animation: sb-pulse 3s ease-in-out infinite;
      }
    `}</style>

    <span
      className={`
        sb-badge
        inline-flex
        items-center
        rounded-full
        border
        px-3
        py-1.5
        text-xs
        font-bold
        tracking-[0.03em]
        backdrop-blur-md
        transition-all
        duration-300
        ${
          statusStyles[value] ||
          "border-white/10 bg-white/5 text-neutral-300"
        }
      `}
    >
      {statusText[value] || value || "Unknown"}
    </span>
  </>
);