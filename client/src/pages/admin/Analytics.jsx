import { useEffect, useState } from "react";
import { Loader, EmptyState } from "../../components/Loader";
import { PageHeader } from "../../components/PageHeader";
import { api } from "../../services/api";
import { titleCase } from "../../utils/constants";

const BarList = ({ title, items, labelPrefix = "" }) => {
  const max = Math.max(...items.map((item) => item.count), 1);
  return (
    <section className="surface p-5">
      <h2 className="mb-4 text-lg font-black">{title}</h2>
      {items.length === 0 ? <EmptyState title="No data" /> : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id}>
              <div className="mb-1 flex justify-between text-sm font-bold">
                <span>{labelPrefix}{titleCase(String(item._id))}</span>
                <span>{item.count}</span>
              </div>
              <div className="h-3 rounded-full bg-neutral-100">
                <div className="h-3 rounded-full bg-black" style={{ width: `${(item.count / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/admin").then(({ data: result }) => setData(result));
  }, []);

  if (!data) return <Loader />;

  return (
    <>
      <PageHeader title="Analytics" description="Operational summary for complaints, wards, applications, and worker approvals." />
      <div className="grid gap-6 lg:grid-cols-2">
        <BarList title="Complaints by category" items={data.complaintsByCategory} />
        <BarList title="Complaints by status" items={data.complaintsByStatus} />
        <BarList title="Ward-wise complaints" items={data.wardWiseComplaints} labelPrefix="Ward " />
      </div>
    </>
  );
}
