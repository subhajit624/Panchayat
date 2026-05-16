export const StatCard = ({
  label,
  value,
  icon: Icon,
}) => (
  <>
    <style>{`
      @keyframes sc-rise {
        from {
          opacity: 0;
          transform: translateY(20px) scale(.98);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes sc-float {
        0%,100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-6px);
        }
      }

      @keyframes sc-glow {
        0%,100% {
          box-shadow: 0 0 20px rgba(99,102,241,.08);
        }
        50% {
          box-shadow: 0 0 36px rgba(99,102,241,.18);
        }
      }

      @keyframes sc-shimmer {
        0% {
          background-position: 0% center;
        }
        100% {
          background-position: 200% center;
        }
      }

      .sc-card {
        animation: sc-rise .55s cubic-bezier(.22,1,.36,1) both;
      }

      .sc-icon-wrap {
        animation: sc-float 3s ease-in-out infinite;
      }

      .sc-hover:hover .sc-icon-wrap {
        animation: sc-glow 2.5s ease-in-out infinite;
      }

      .sc-value {
        background: linear-gradient(120deg,#ffffff 0%,#a5b4fc 50%,#34d399 100%);
        background-size: 200% auto;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: sc-shimmer 5s linear infinite;
      }
    `}</style>

    <div
      className="
        sc-card
        sc-hover
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-white/5
        p-5
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-indigo-400/20
      "
      style={{
        boxShadow: "0 18px 40px rgba(0,0,0,.22)",
      }}
    >
      {/* subtle glow */}
      <div
        className="absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl"
        style={{
          background: "rgba(99,102,241,.08)",
        }}
      />

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-[0.02em] text-neutral-400">
            {label}
          </p>

          <p className="sc-value mt-3 text-4xl font-black">
            {value ?? 0}
          </p>
        </div>

        {Icon ? (
          <div
            className="
              sc-icon-wrap
              grid
              h-14
              w-14
              place-items-center
              rounded-2xl
              border
              border-indigo-400/20
              bg-gradient-to-br
              from-indigo-500/20
              to-violet-500/10
              text-indigo-300
              transition-all
              duration-300
              group-hover:text-white
              group-hover:border-indigo-400/35
            "
          >
            <Icon size={22} />
          </div>
        ) : null}
      </div>
    </div>
  </>
);