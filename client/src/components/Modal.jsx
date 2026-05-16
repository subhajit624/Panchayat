import { X } from "lucide-react";
import { Button } from "./Button";

export const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
}) => {
  if (!open) return null;

  return (
    <>
      <style>{`
        @keyframes md-fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes md-rise {
          from {
            opacity: 0;
            transform: translateY(28px) scale(.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes md-float {
          0%,100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-12px) scale(1.03);
          }
        }

        .md-overlay {
          animation: md-fade .25s ease forwards;
          backdrop-filter: blur(10px);
        }

        .md-panel {
          animation: md-rise .35s cubic-bezier(.22,1,.36,1) forwards;
        }

        .md-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
          animation: md-float 10s ease-in-out infinite;
        }

        .md-title {
          background: linear-gradient(120deg,#ffffff 0%,#a5b4fc 50%,#34d399 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="md-overlay fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
        <div
          className="md-panel relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d14] shadow-2xl"
          style={{
            boxShadow: "0 30px 80px rgba(0,0,0,.45)",
          }}
        >
          {/* glow blobs */}
          <div
            className="md-blob"
            style={{
              top: "-60px",
              right: "-40px",
              width: "220px",
              height: "220px",
              background: "rgba(99,102,241,.12)",
            }}
          />

          <div
            className="md-blob"
            style={{
              bottom: "-60px",
              left: "-30px",
              width: "180px",
              height: "180px",
              background: "rgba(52,211,153,.08)",
              animationDelay: "5s",
            }}
          />

          {/* header */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-6 py-5">
            <h2 className="md-title text-xl font-black">
              {title}
            </h2>

            <Button
              variant="ghost"
              className="h-10 w-10 rounded-xl px-0 text-white hover:bg-white/10"
              onClick={onClose}
              aria-label="Close"
              icon={X}
            />
          </div>

          {/* body */}
          <div className="relative z-10 max-h-[65vh] overflow-y-auto p-6 app-scrollbar text-neutral-200">
            {children}
          </div>

          {/* footer */}
          {footer ? (
            <div className="relative z-10 border-t border-white/10 bg-white/[0.02] p-6">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};