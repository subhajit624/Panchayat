import { Sparkles } from "lucide-react";

export const Loader = ({ label = "Loading" }) => (
  <>
    <style>{`
      @keyframes ld-spin {
        to {
          transform: rotate(360deg);
        }
      }

      @keyframes ld-pulse {
        0%,100% {
          transform: scale(1);
          opacity: .85;
        }
        50% {
          transform: scale(1.08);
          opacity: 1;
        }
      }

      .ld-ring {
        animation: ld-spin .8s linear infinite;
      }

      .ld-pulse {
        animation: ld-pulse 1.8s ease-in-out infinite;
      }
    `}</style>

    <div className="grid min-h-48 place-items-center">
      <div
        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl"
        style={{
          boxShadow: "0 12px 30px rgba(0,0,0,.25)",
        }}
      >
        <div className="relative">
          <div
            className="ld-ring h-10 w-10 rounded-full border-[3px] border-white/10 border-t-indigo-500"
          />
          <div className="absolute inset-0 grid place-items-center">
            <Sparkles
              size={14}
              className="ld-pulse text-indigo-400"
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-bold tracking-[0.02em] text-white">
            {label}
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            Please wait a moment...
          </p>
        </div>
      </div>
    </div>
  </>
);

export const EmptyState = ({
  title = "Nothing here yet",
  description,
}) => (
  <>
    <style>{`
      @keyframes es-float {
        0%,100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-8px);
        }
      }

      @keyframes es-glow {
        0%,100% {
          box-shadow: 0 0 20px rgba(99,102,241,.12);
        }
        50% {
          box-shadow: 0 0 35px rgba(99,102,241,.22);
        }
      }

      .es-icon-wrap {
        animation: es-float 3s ease-in-out infinite;
      }

      .es-glow {
        animation: es-glow 3s ease-in-out infinite;
      }
    `}</style>

    <div
      className="grid min-h-52 place-items-center rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl"
      style={{
        boxShadow: "0 18px 40px rgba(0,0,0,.22)",
      }}
    >
      <div>
        <div
          className="es-icon-wrap es-glow mx-auto mb-5 grid h-20 w-20 place-items-center rounded-3xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/20 to-violet-500/10"
        >
          <Sparkles size={28} className="text-indigo-400" />
        </div>

        <p className="text-xl font-black text-white">
          {title}
        </p>

        {description ? (
          <p className="mt-3 max-w-md text-sm leading-6 text-neutral-400">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  </>
);