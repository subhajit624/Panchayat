export const PageHeader = ({
  eyebrow,
  title,
  description,
  action,
}) => (
  <>
    <style>{`
      @keyframes ph-rise {
        from {
          opacity: 0;
          transform: translateY(22px) scale(.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes ph-shimmer {
        0% {
          background-position: 0% center;
        }
        100% {
          background-position: 200% center;
        }
      }

      @keyframes ph-float {
        0%,100% {
          transform: translateY(0) scale(1);
        }
        50% {
          transform: translateY(-10px) scale(1.02);
        }
      }

      .ph-wrap {
        animation: ph-rise .6s cubic-bezier(.22,1,.36,1) both;
      }

      .ph-gradient-text {
        background: linear-gradient(120deg,#ffffff 0%,#a5b4fc 50%,#34d399 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: ph-shimmer 5s linear infinite;
      }

      .ph-blob {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        filter: blur(60px);
        animation: ph-float 10s ease-in-out infinite;
      }
    `}</style>

    <div
      className="ph-wrap relative mb-8 overflow-hidden rounded-3xl border border-white/10 px-6 py-7 md:px-8"
      style={{
        background: "linear-gradient(135deg,#0d0d1e 0%,#0a0a16 100%)",
        boxShadow: "0 20px 50px rgba(0,0,0,.28)",
      }}
    >
      {/* glow blobs */}
      <div
        className="ph-blob"
        style={{
          top: "-50px",
          right: "-30px",
          width: "220px",
          height: "220px",
          background: "rgba(99,102,241,.12)",
        }}
      />

      <div
        className="ph-blob"
        style={{
          bottom: "-50px",
          left: "-20px",
          width: "180px",
          height: "180px",
          background: "rgba(52,211,153,.08)",
          animationDelay: "5s",
        }}
      />

      <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          {eyebrow ? (
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
              {eyebrow}
            </p>
          ) : null}

          <h1 className="text-3xl font-black leading-tight md:text-5xl">
            <span className="ph-gradient-text">
              {title}
            </span>
          </h1>

          {description ? (
            <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-400 md:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {action ? (
          <div className="relative z-10 shrink-0">
            {action}
          </div>
        ) : null}
      </div>
    </div>
  </>
);