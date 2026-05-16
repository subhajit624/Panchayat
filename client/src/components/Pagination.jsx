import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

export const Pagination = ({ pagination, onPage }) => {
  if (!pagination || pagination.pages <= 1) return null;

  return (
    <>
      <style>{`
        @keyframes pg-rise {
          from {
            opacity: 0;
            transform: translateY(18px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pg-pulse {
          0%,100% {
            box-shadow: 0 0 20px rgba(99,102,241,.08);
          }
          50% {
            box-shadow: 0 0 35px rgba(99,102,241,.18);
          }
        }

        .pg-wrap {
          animation: pg-rise .55s cubic-bezier(.22,1,.36,1) both;
        }

        .pg-card {
          animation: pg-pulse 4s ease-in-out infinite;
        }
      `}</style>

      <div className="pg-wrap mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Page info */}
        <div
          className="pg-card rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl"
          style={{
            boxShadow: "0 12px 28px rgba(0,0,0,.18)",
          }}
        >
          <p className="text-sm font-semibold text-neutral-300">
            Page{" "}
            <span className="font-black text-white">
              {pagination.page}
            </span>{" "}
            of{" "}
            <span className="font-black text-indigo-400">
              {pagination.pages}
            </span>
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            icon={ChevronLeft}
            disabled={pagination.page <= 1}
            onClick={() => onPage(pagination.page - 1)}
          >
            Prev
          </Button>

          <Button
            variant="secondary"
            icon={ChevronRight}
            disabled={pagination.page >= pagination.pages}
            onClick={() => onPage(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};