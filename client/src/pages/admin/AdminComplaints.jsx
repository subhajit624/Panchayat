import { UserRoundCheck } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import { Field, Input, Select } from "../../components/FormField";
import { Loader, EmptyState } from "../../components/Loader";
import { Modal } from "../../components/Modal";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { StatusBadge } from "../../components/StatusBadge";
import { api, getErrorMessage } from "../../services/api";
import { complaintCategories, titleCase, workerCategories } from "../../utils/constants";

export default function AdminComplaints() {
  const [data, setData] = useState({ items: [], pagination: null });
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", status: "", category: "", wardNumber: "", page: 1 });
  const [assigning, setAssigning] = useState(null);
  const [workerId, setWorkerId] = useState("");
  const [workerCategory, setWorkerCategory] = useState("");

  const load = async () => {
    setLoading(true);
    const { data: result } = await api.get("/complaints", { params: filters });
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filters]);

  useEffect(() => {
    api.get("/users/workers", { params: { limit: 50, category: workerCategory } }).then(({ data }) => setWorkers(data.items));
  }, [workerCategory]);

  const assign = async () => {
    try {
      await api.patch(`/complaints/${assigning._id}/assign`, { workerId });
      toast.success("Worker assigned.");
      setAssigning(null);
      setWorkerId("");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <PageHeader title="Complaints" description="Filter ward complaints, assign approved workers, and monitor resolution progress." />
      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <Field label="Search"><Input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} /></Field>
        <Field label="Status">
          <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
            <option value="">All</option>
            {["pending", "in-progress", "completed", "confirmed"].map((status) => <option key={status} value={status}>{titleCase(status)}</option>)}
          </Select>
        </Field>
        <Field label="Category">
          <Select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}>
            <option value="">All</option>
            {complaintCategories.map((category) => <option key={category} value={category}>{titleCase(category)}</option>)}
          </Select>
        </Field>
        <Field label="Ward"><Input value={filters.wardNumber} type="number" min="1" onChange={(e) => setFilters({ ...filters, wardNumber: e.target.value, page: 1 })} /></Field>
      </div>
      {loading ? <Loader /> : data.items.length === 0 ? <EmptyState title="No complaints found" /> : (
        <div className="grid gap-4">
          {data.items.map((complaint) => (
            <article key={complaint._id} className="surface p-5">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black">{complaint.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{complaint.description}</p>
                  <p className="mt-2 text-sm text-neutral-500">
                    Citizen: {complaint.citizenId?.name} - Ward {complaint.wardNumber} - {titleCase(complaint.category)}
                  </p>
                </div>
                <div className="flex h-max flex-wrap gap-2">
                  <StatusBadge value={complaint.status} />
                  <StatusBadge value={complaint.priority} />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold">Worker: {complaint.assignedWorker?.name || "Not assigned"}</span>
                <Button variant="secondary" icon={UserRoundCheck} onClick={() => setAssigning(complaint)}>
                  Assign worker
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
      <Pagination pagination={data.pagination} onPage={(page) => setFilters({ ...filters, page })} />
      <Modal open={Boolean(assigning)} title="Assign worker" onClose={() => setAssigning(null)} footer={<Button onClick={assign} disabled={!workerId}>Assign</Button>}>
        <div className="space-y-4">
          <Field label="Filter by worker category">
            <Select value={workerCategory} onChange={(e) => setWorkerCategory(e.target.value)}>
              <option value="">All workers</option>
              {workerCategories.map((category) => <option key={category} value={category}>{titleCase(category)}</option>)}
            </Select>
          </Field>
          <Field label="Worker">
            <Select value={workerId} onChange={(e) => setWorkerId(e.target.value)}>
              <option value="">Select worker</option>
              {workers.map((worker) => (
                <option key={worker._id} value={worker._id}>
                  {worker.name} - {titleCase(worker.workerDetails?.category)} - {worker.workerDetails?.rating || 0}/5
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Modal>
    </>
  );
}
