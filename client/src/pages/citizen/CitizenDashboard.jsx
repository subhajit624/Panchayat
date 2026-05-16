import { Bell, ClipboardList, FileCheck, Home } from "lucide-react";
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
      <PageHeader title="Citizen Dashboard" description="Track your complaints, applications, certificates, and latest Panchayat notices." />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Pending complaints" value={counts.pending || 0} icon={ClipboardList} />
        <StatCard label="In progress" value={counts["in-progress"] || 0} icon={Home} />
        <StatCard label="Completed" value={counts.completed || 0} icon={FileCheck} />
        <StatCard label="Confirmed" value={counts.confirmed || 0} icon={Bell} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black">Recent complaints</h2>
            <Link className="text-sm font-bold underline" to="/citizen/complaints">View all</Link>
          </div>
          {data.complaints.length === 0 ? <EmptyState title="No complaints yet" /> : (
            <div className="space-y-3">
              {data.complaints.map((complaint) => (
                <div key={complaint._id} className="rounded-lg border border-neutral-200 p-3">
                  <div className="flex justify-between gap-3">
                    <p className="font-bold">{complaint.title}</p>
                    <StatusBadge value={complaint.status} />
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">{complaint.assignedWorker?.name || "Worker not assigned"}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="surface p-5">
          <h2 className="mb-4 text-lg font-black">Latest notices</h2>
          {data.notices.length === 0 ? <EmptyState title="No notices" /> : (
            <div className="space-y-3">
              {data.notices.map((notice) => (
                <div key={notice._id} className="rounded-lg border border-neutral-200 p-3">
                  <div className="flex justify-between gap-3">
                    <p className="font-bold">{notice.title}</p>
                    <StatusBadge value={notice.priority} />
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{notice.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="surface p-5">
          <h2 className="mb-4 text-lg font-black">Scheme applications</h2>
          {data.schemeApplications.length === 0 ? <EmptyState title="No scheme applications" /> : (
            <div className="space-y-3">
              {data.schemeApplications.map((application) => (
                <div key={application._id} className="rounded-lg border border-neutral-200 p-3">
                  <p className="font-bold">{application.scheme?.title}</p>
                  <StatusBadge value={application.status} />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="surface p-5">
          <h2 className="mb-4 text-lg font-black">Certificates</h2>
          {data.certificates.length === 0 ? <EmptyState title="No certificate requests" /> : (
            <div className="space-y-3">
              {data.certificates.map((certificate) => (
                <div key={certificate._id} className="rounded-lg border border-neutral-200 p-3">
                  <p className="font-bold">{certificate.type}</p>
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
