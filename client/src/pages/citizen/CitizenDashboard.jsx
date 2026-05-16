import {
  Bell,
  ClipboardList,
  FileCheck,
  Home,
  ArrowRight,
  FileText,
  Megaphone,
  Landmark,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState, Loader } from "../../components/Loader";
import { PageHeader } from "../../components/PageHeader";
import { StatCard } from "../../components/StatCard";
import { StatusBadge } from "../../components/StatusBadge";
import { api } from "../../services/api";

export default function CitizenDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/citizen").then(({ data: result }) => {
      setData(result);
      setLoading(false);
    });
  }, []);

  const counts = useMemo(() => {
    const map = {};

    data?.counts?.forEach((item) => {
      map[item._id] = item.count;
    });

    return map;
  }, [data]);

  if (loading) return <Loader />;

  return (
    <>
      <style>{`
        @keyframes cd-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes cd-float {
          0%,100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .cd-card {
          animation: cd-rise .6s cubic-bezier(.22,1,.36,1) both;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 45px rgba(0,0,0,.22);
        }

        .cd-float {
          animation: cd-float 3s ease-in-out infinite;
        }
      `}</style>

      <PageHeader
        title="Citizen Dashboard"
        description="Track your complaints, applications, certificates, and latest Panchayat notices."
      />

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard
          label="Pending complaints"
          value={counts.pending || 0}
          icon={ClipboardList}
        />

        <StatCard
          label="In progress"
          value={counts["in-progress"] || 0}
          icon={Home}
        />

        <StatCard
          label="Completed"
          value={counts.completed || 0}
          icon={FileCheck}
        />

        <StatCard
          label="Confirmed"
          value={counts.confirmed || 0}
          icon={Bell}
        />
      </div>

      {/* Dashboard sections */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Complaints */}
        <section className="cd-card rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className="
                  cd-float
                  grid
                  h-14
                  w-14
                  place-items-center
                  rounded-2xl
                  border
                  border-amber-400/20
                  bg-gradient-to-br
                  from-amber-500/20
                  to-orange-500/10
                  text-amber-300
                "
              >
                <ClipboardList size={22} />
              </div>

              <div>
                <h2 className="text-2xl font-black text-white">
                  Recent Complaints
                </h2>
              </div>
            </div>

            <Link
              to="/citizen/complaints"
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
              View all
              <ArrowRight size={15} />
            </Link>
          </div>

          {data.complaints.length === 0 ? (
            <EmptyState title="No complaints yet" />
          ) : (
            <div className="space-y-4">
              {data.complaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    p-4
                    transition-all
                    duration-300
                    hover:border-indigo-400/20
                  "
                >
                  <div className="flex justify-between gap-3">
                    <p className="font-black text-white">
                      {complaint.title}
                    </p>

                    <StatusBadge value={complaint.status} />
                  </div>

                  <p className="mt-2 text-sm text-neutral-400">
                    {complaint.assignedWorker?.name ||
                      "Worker not assigned"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Notices */}
        <section className="cd-card rounded-3xl p-6">
          <div className="mb-5 flex items-center gap-4">
            <div
              className="
                cd-float
                grid
                h-14
                w-14
                place-items-center
                rounded-2xl
                border
                border-rose-400/20
                bg-gradient-to-br
                from-rose-500/20
                to-pink-500/10
                text-rose-300
              "
            >
              <Megaphone size={22} />
            </div>

            <h2 className="text-2xl font-black text-white">
              Latest Notices
            </h2>
          </div>

          {data.notices.length === 0 ? (
            <EmptyState title="No notices" />
          ) : (
            <div className="space-y-4">
              {data.notices.map((notice) => (
                <div
                  key={notice._id}
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    p-4
                  "
                >
                  <div className="flex justify-between gap-3">
                    <p className="font-black text-white">
                      {notice.title}
                    </p>

                    <StatusBadge value={notice.priority} />
                  </div>

                  <p className="mt-2 line-clamp-2 text-sm text-neutral-400">
                    {notice.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Schemes */}
        <section className="cd-card rounded-3xl p-6">
          <div className="mb-5 flex items-center gap-4">
            <div
              className="
                cd-float
                grid
                h-14
                w-14
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
              <Landmark size={22} />
            </div>

            <h2 className="text-2xl font-black text-white">
              Scheme Applications
            </h2>
          </div>

          {data.schemeApplications.length === 0 ? (
            <EmptyState title="No scheme applications" />
          ) : (
            <div className="space-y-4">
              {data.schemeApplications.map((application) => (
                <div
                  key={application._id}
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    p-4
                    flex
                    justify-between
                    gap-4
                  "
                >
                  <p className="font-black text-white">
                    {application.scheme?.title}
                  </p>

                  <StatusBadge value={application.status} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Certificates */}
        <section className="cd-card rounded-3xl p-6">
          <div className="mb-5 flex items-center gap-4">
            <div
              className="
                cd-float
                grid
                h-14
                w-14
                place-items-center
                rounded-2xl
                border
                border-cyan-400/20
                bg-gradient-to-br
                from-cyan-500/20
                to-sky-500/10
                text-cyan-300
              "
            >
              <FileText size={22} />
            </div>

            <h2 className="text-2xl font-black text-white">
              Certificates
            </h2>
          </div>

          {data.certificates.length === 0 ? (
            <EmptyState title="No certificate requests" />
          ) : (
            <div className="space-y-4">
              {data.certificates.map((certificate) => (
                <div
                  key={certificate._id}
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    p-4
                    flex
                    justify-between
                    gap-4
                  "
                >
                  <p className="font-black text-white">
                    {certificate.type}
                  </p>

                  <StatusBadge value={certificate.status} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}