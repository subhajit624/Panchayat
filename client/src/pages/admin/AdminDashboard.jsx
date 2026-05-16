import { ClipboardList, FileCheck, Users, Wrench } from "lucide-react";
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
      <PageHeader title="Admin Dashboard" description="Monitor users, approvals, complaints, scheme applications, certificates, and ward activity." />
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total users" value={analytics.cards.totalUsers} icon={Users} />
        <StatCard label="Active workers" value={analytics.cards.activeWorkers} icon={Wrench} />
        <StatCard label="Pending approvals" value={analytics.cards.pendingApprovals} icon={Wrench} />
        <StatCard label="Completed complaints" value={analytics.cards.completedComplaints} icon={ClipboardList} />
        <StatCard label="Scheme apps" value={analytics.cards.schemeApplications} icon={FileCheck} />
        <StatCard label="Certificates" value={analytics.cards.certificateRequests} icon={FileCheck} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black">Complaints by category</h2>
            <Link to="/admin/analytics" className="text-sm font-bold underline">Details</Link>
          </div>
          <div className="space-y-3">
            {analytics.complaintsByCategory.map((item) => (
              <div key={item._id}>
                <div className="mb-1 flex justify-between text-sm font-bold">
                  <span>{titleCase(item._id)}</span>
                  <span>{item.count}</span>
                </div>
                <div className="h-2 rounded-full bg-neutral-100">
                  <div className="h-2 rounded-full bg-black" style={{ width: `${Math.min(item.count * 12, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="surface p-5">
          <h2 className="mb-4 text-lg font-black">Ward-wise complaints</h2>
          <div className="grid gap-2 md:grid-cols-2">
            {analytics.wardWiseComplaints.slice(0, 10).map((item) => (
              <div key={item._id} className="flex justify-between rounded-lg border border-neutral-200 p-3 text-sm font-bold">
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
