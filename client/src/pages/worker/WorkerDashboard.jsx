import { CheckCircle2, Clock, ClipboardList, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EmptyState, Loader } from "../../components/Loader";
import { PageHeader } from "../../components/PageHeader";
import { StatCard } from "../../components/StatCard";
import { StatusBadge } from "../../components/StatusBadge";
import { api } from "../../services/api";

export default function WorkerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/worker").then(({ data: result }) => setData(result));
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
      <PageHeader title="Worker Dashboard" description="View assigned complaints, update progress, and track ratings from completed work." />
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Assigned" value={data.assignedComplaints.length} icon={ClipboardList} />
        <StatCard label="In progress" value={counts["in-progress"] || 0} icon={Clock} />
        <StatCard label="Completed" value={counts.completed || 0} icon={CheckCircle2} />
        <StatCard label="Rating" value={data.workerDetails?.rating || 0} icon={Star} />
      </div>
      <section className="mt-6 surface p-5">
        <h2 className="mb-4 text-lg font-black">Latest tasks</h2>
        {data.assignedComplaints.length === 0 ? <EmptyState title="No assigned complaints" /> : (
          <div className="grid gap-3">
            {data.assignedComplaints.map((complaint) => (
              <div key={complaint._id} className="rounded-lg border border-neutral-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">{complaint.title}</p>
                    <p className="mt-1 text-sm text-neutral-500">Ward {complaint.wardNumber} - {complaint.citizenId?.name}</p>
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
