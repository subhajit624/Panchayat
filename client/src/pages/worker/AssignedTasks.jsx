import { CheckCircle2, Play } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import { Field, Select } from "../../components/FormField";
import { EmptyState, Loader } from "../../components/Loader";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { StatusBadge } from "../../components/StatusBadge";
import { api, getErrorMessage } from "../../services/api";
import { titleCase } from "../../utils/constants";

export default function AssignedTasks() {
  const [data, setData] = useState({ items: [], pagination: null });
  const [filters, setFilters] = useState({ status: "", page: 1 });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data: result } = await api.get("/complaints/assigned", { params: filters });
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filters]);

  const updateStatus = async (complaint, status) => {
    try {
      await api.patch(`/complaints/${complaint._id}/status`, { status });
      toast.success("Status updated.");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <PageHeader title="Assigned Tasks" description="Move assigned complaints from in progress to completed after field work is done." />
      <div className="mb-5 max-w-xs">
        <Field label="Status">
          <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
            <option value="">All</option>
            {["in-progress", "completed", "confirmed"].map((status) => <option key={status} value={status}>{titleCase(status)}</option>)}
          </Select>
        </Field>
      </div>
      {loading ? <Loader /> : data.items.length === 0 ? <EmptyState title="No assigned tasks" /> : (
        <div className="grid gap-4">
          {data.items.map((complaint) => (
            <article key={complaint._id} className="surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black">{complaint.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{complaint.description}</p>
                  <p className="mt-2 text-sm text-neutral-500">Citizen: {complaint.citizenId?.name} - Ward {complaint.wardNumber}</p>
                </div>
                <StatusBadge value={complaint.status} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {complaint.status === "pending" ? (
                  <Button icon={Play} onClick={() => updateStatus(complaint, "in-progress")}>Start work</Button>
                ) : null}
                {complaint.status === "in-progress" ? (
                  <Button icon={CheckCircle2} onClick={() => updateStatus(complaint, "completed")}>Mark completed</Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
      <Pagination pagination={data.pagination} onPage={(page) => setFilters({ ...filters, page })} />
    </>
  );
}
