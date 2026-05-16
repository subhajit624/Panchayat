import { Activity, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { Loader, EmptyState } from "../../components/Loader";
import { PageHeader } from "../../components/PageHeader";
import { api } from "../../services/api";
import { titleCase } from "../../utils/constants";

const BarList = ({
  title,
  items,
  labelPrefix = "",
}) => {
  const max = Math.max(...items.map((item) => item.count), 1);

  return (
    <>
      <style>{`
        @keyframes anl-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes anl-glow {
          0%,100% {
            box-shadow: 0 0 18px rgba(99,102,241,.08);
          }
          50% {
            box-shadow: 0 0 35px rgba(99,102,241,.16);
          }
        }

        @keyframes anl-float {
          0%,100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }

        .anl-card {
          animation: anl-rise .6s cubic-bezier(.22,1,.36,1) both;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 45px rgba(0,0,0,.22);
        }

        .anl-progress {
          animation: anl-glow 3s ease-in-out infinite;
        }

        .anl-icon {
          animation: anl-float 3s ease-in-out infinite;
        }
      `}</style>

      <section
        className="
          anl-card
          rounded-3xl
          p-6
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-indigo-400/20
        "
      >
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <div
            className="
              anl-icon
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
            "
          >
            <BarChart3 size={22} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">
              {title}
            </h2>

            <p className="mt-1 text-sm text-neutral-400">
              Real-time analytics breakdown
            </p>
          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <EmptyState title="No data" />
        ) : (
          <div className="space-y-5">
            {items.map((item) => (
              <div key={item._id}>
                <div className="mb-2 flex justify-between text-sm font-bold">
                  <span className="text-neutral-300">
                    {labelPrefix}
                    {titleCase(String(item._id))}
                  </span>

                  <span className="text-white">
                    {item.count}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/8">
                  <div
                    className="
                      anl-progress
                      h-3
                      rounded-full
                      bg-gradient-to-r
                      from-indigo-500
                      to-violet-500
                    "
                    style={{
                      width: `${(item.count / max) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get("/dashboard/admin")
      .then(({ data: result }) => setData(result));
  }, []);

  if (!data) return <Loader />;

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Operational summary for complaints, wards, applications, and worker approvals."
      />

      {/* Summary Banner */}
      <div
        className="
          mb-6
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-6
          backdrop-blur-xl
        "
        style={{
          boxShadow: "0 18px 45px rgba(0,0,0,.22)",
        }}
      >
        <div className="flex flex-wrap items-center gap-4">
          <div
            className="
              grid
              h-16
              w-16
              place-items-center
              rounded-2xl
              border
              border-emerald-400/20
              bg-gradient-to-br
              from-emerald-500/20
              to-teal-500/10
              text-emerald-300
            "
          >
            <Activity size={26} />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">
              Panchayat Operational Insights
            </h2>

            <p className="mt-2 text-sm leading-7 text-neutral-300">
              Monitor complaint distribution, ward activity, and
              administrative performance through visual analytics.
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BarList
          title="Complaints by category"
          items={data.complaintsByCategory}
        />

        <BarList
          title="Complaints by status"
          items={data.complaintsByStatus}
        />

        <BarList
          title="Ward-wise complaints"
          items={data.wardWiseComplaints}
          labelPrefix="Ward "
        />
      </div>
    </>
  );
}