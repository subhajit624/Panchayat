import {
  ClipboardList,
  FileCheck,
  Users,
  Wrench,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader } from "../../components/Loader";
import { PageHeader } from "../../components/PageHeader";
import { StatCard } from "../../components/StatCard";
import { api } from "../../services/api";
import { titleCase } from "../../utils/constants";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get("/dashboard/admin").then(({ data }) => setAnalytics(data));
  }, []);

  if (!analytics) return <Loader />;

  return (
    <>
      <style>{`
        @keyframes ad-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes ad-glow {
          0%,100% {
            box-shadow: 0 0 20px rgba(99,102,241,.08);
          }
          50% {
            box-shadow: 0 0 40px rgba(99,102,241,.18);
          }
        }

        .ad-rise {
          animation: ad-rise .6s cubic-bezier(.22,1,.36,1) both;
        }

        .ad-panel {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 45px rgba(0,0,0,.22);
        }

        .ad-progress-glow {
          animation: ad-glow 3s ease-in-out infinite;
        }
      `}</style>

      <PageHeader
        title="Admin Dashboard"
        description="Monitor users, approvals, complaints, scheme applications, certificates, and ward activity."
      />

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Total users"
          value={analytics.cards.totalUsers}
          icon={Users}
        />

        <StatCard
          label="Active workers"
          value={analytics.cards.activeWorkers}
          icon={Wrench}
        />

        <StatCard
          label="Pending approvals"
          value={analytics.cards.pendingApprovals}
          icon={Wrench}
        />

        <StatCard
          label="Completed complaints"
          value={analytics.cards.completedComplaints}
          icon={ClipboardList}
        />

        <StatCard
          label="Scheme apps"
          value={analytics.cards.schemeApplications}
          icon={FileCheck}
        />

        <StatCard
          label="Certificates"
          value={analytics.cards.certificateRequests}
          icon={FileCheck}
        />
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Complaints by category */}
        <section
          className="
            ad-panel
            ad-rise
            rounded-3xl
            p-6
            transition-all
            duration-300
            hover:-translate-y-1
          "
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">
                Complaints by category
              </h2>

              <p className="mt-2 text-sm text-neutral-400">
                Category-wise complaint distribution
              </p>
            </div>

            <Link
              to="/admin/analytics"
              className="
                inline-flex
                items-center
                gap-2
                rounded-2xl
                border
                border-indigo-400/20
                bg-indigo-500/10
                px-4
                py-2
                text-sm
                font-bold
                text-indigo-300
                transition-all
                duration-300
                hover:bg-indigo-500/20
                hover:text-white
              "
            >
              Details
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="space-y-5">
            {analytics.complaintsByCategory.map((item) => (
              <div key={item._id}>
                <div className="mb-2 flex justify-between text-sm font-bold">
                  <span className="text-neutral-300">
                    {titleCase(item._id)}
                  </span>

                  <span className="text-white">
                    {item.count}
                  </span>
                </div>

                <div className="h-3 rounded-full bg-white/8 overflow-hidden">
                  <div
                    className="
                      ad-progress-glow
                      h-3
                      rounded-full
                      bg-gradient-to-r
                      from-indigo-500
                      to-violet-500
                    "
                    style={{
                      width: `${Math.min(item.count * 12, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ward wise */}
        <section
          className="
            ad-panel
            ad-rise
            rounded-3xl
            p-6
            transition-all
            duration-300
            hover:-translate-y-1
          "
          style={{
            animationDelay: "120ms",
          }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white">
              Ward-wise complaints
            </h2>

            <p className="mt-2 text-sm text-neutral-400">
              Top complaint activity by wards
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {analytics.wardWiseComplaints
              .slice(0, 10)
              .map((item) => (
                <div
                  key={item._id}
                  className="
                    flex
                    justify-between
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    px-4
                    py-4
                    text-sm
                    font-bold
                    text-neutral-300
                    transition-all
                    duration-300
                    hover:border-indigo-400/20
                    hover:bg-indigo-500/10
                    hover:text-white
                  "
                >
                  <span>Ward {item._id}</span>
                  <span>{item.count}</span>
                </div>
              ))}
          </div>
        </section>
      </div>
    </>
  );
}