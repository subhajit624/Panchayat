import {
  CheckCircle2,
  Clock,
  ClipboardList,
  Star,
  Briefcase,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EmptyState, Loader } from "../../components/Loader";
import { PageHeader } from "../../components/PageHeader";
import { StatCard } from "../../components/StatCard";
import { StatusBadge } from "../../components/StatusBadge";
import { api } from "../../services/api";

export default function WorkerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/worker").then(({ data: result }) =>
      setData(result)
    );
  }, []);

  const counts = useMemo(() => {
    const map = {};

    data?.counts?.forEach((item) => {
      map[item._id] = item.count;
    });

    return map;
  }, [data]);

  if (!data) return <Loader />;

  return (
    <>
      <style>{`
        @keyframes wd-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes wd-float {
          0%,100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .wd-card {
          animation: wd-rise .6s cubic-bezier(.22,1,.36,1) both;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 45px rgba(0,0,0,.22);
        }

        .wd-float {
          animation: wd-float 3s ease-in-out infinite;
        }
      `}</style>

      <PageHeader
        title="Worker Dashboard"
        description="View assigned complaints, update progress, and track ratings from completed work."
      />

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard
          label="Assigned"
          value={data.assignedComplaints.length}
          icon={ClipboardList}
        />

        <StatCard
          label="In progress"
          value={counts["in-progress"] || 0}
          icon={Clock}
        />

        <StatCard
          label="Completed"
          value={counts.completed || 0}
          icon={CheckCircle2}
        />

        <StatCard
          label="Rating"
          value={data.workerDetails?.rating || 0}
          icon={Star}
        />
      </div>

      {/* Latest Tasks */}
      <section className="mt-8 wd-card rounded-3xl p-6">
        <div className="mb-6 flex items-center gap-5">
          <div
            className="
              wd-float
              grid
              h-16
              w-16
              place-items-center
              rounded-3xl
              border
              border-amber-400/20
              bg-gradient-to-br
              from-amber-500/20
              to-orange-500/10
              text-amber-300
            "
          >
            <Briefcase size={28} />
          </div>

          <div>
            <h2 className="text-3xl font-black text-white">
              Latest Tasks
            </h2>

            <p className="mt-1 text-sm text-neutral-400">
              Your recent assigned complaint work
            </p>
          </div>
        </div>

        {data.assignedComplaints.length === 0 ? (
          <EmptyState title="No assigned complaints" />
        ) : (
          <div className="grid gap-4">
            {data.assignedComplaints.map((complaint) => (
              <div
                key={complaint._id}
                className="
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/5
                  p-5
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-indigo-400/20
                "
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xl font-black text-white">
                      {complaint.title}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-sm text-neutral-400">
                      <User size={15} />
                      Ward {complaint.wardNumber} —{" "}
                      {complaint.citizenId?.name}
                    </div>
                  </div>

                  <StatusBadge value={complaint.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}