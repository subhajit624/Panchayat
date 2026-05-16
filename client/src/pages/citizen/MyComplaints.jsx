import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import { Field, Input, Select, Textarea } from "../../components/FormField";
import { Loader, EmptyState } from "../../components/Loader";
import { Modal } from "../../components/Modal";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { StatusBadge } from "../../components/StatusBadge";
import { api, getErrorMessage } from "../../services/api";
import { complaintCategories, titleCase } from "../../utils/constants";

export default function MyComplaints() {
  const [data, setData] = useState({ items: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", category: "", search: "", page: 1 });
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 5, feedback: "" });

  const load = async () => {
    setLoading(true);
    const { data: result } = await api.get("/complaints/mine", { params: filters });
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filters]);

  const confirm = async () => {
    try {
      await api.patch(`/complaints/${selected._id}/confirm`, feedback);
      toast.success("Complaint confirmed.");
      setSelected(null);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <PageHeader title="My Complaints" description="Search, filter, and confirm resolved complaints with worker feedback." />
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
      </div>
      {loading ? <Loader /> : data.items.length === 0 ? <EmptyState title="No complaints found" /> : (
        <div className="grid gap-4">
          {data.items.map((complaint) => (
            <article key={complaint._id} className="surface p-5">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black">{complaint.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{complaint.description}</p>
                </div>
                <div className="flex h-max flex-wrap gap-2">
                  <StatusBadge value={complaint.status} />
                  <StatusBadge value={complaint.priority} />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
                <span>Category: {titleCase(complaint.category)}</span>
                <span>Worker: {complaint.assignedWorker?.name || "Not assigned"}</span>
              </div>
              {complaint.image?.url ? <img src={complaint.image.url} alt="" className="mt-4 max-h-56 rounded-lg border border-neutral-200 object-cover" /> : null}
              {complaint.status === "completed" ? (
                <Button className="mt-4" icon={Star} onClick={() => setSelected(complaint)}>
                  Confirm completion
                </Button>
              ) : null}
            </article>
          ))}
        </div>
      )}
      <Pagination pagination={data.pagination} onPage={(page) => setFilters({ ...filters, page })} />
      <Modal
        open={Boolean(selected)}
        title="Rate worker"
        onClose={() => setSelected(null)}
        footer={<Button onClick={confirm} icon={Star}>Submit feedback</Button>}
      >
        <div className="space-y-4">
          <Field label="Rating">
            <Select value={feedback.rating} onChange={(e) => setFeedback({ ...feedback, rating: Number(e.target.value) })}>
              {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
            </Select>
          </Field>
          <Field label="Feedback">
            <Textarea value={feedback.feedback} onChange={(e) => setFeedback({ ...feedback, feedback: e.target.value })} />
          </Field>
        </div>
      </Modal>
    </>
  );
}
