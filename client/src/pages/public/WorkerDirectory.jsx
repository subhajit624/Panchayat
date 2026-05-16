import { MessageSquare, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Field, Input, Select } from "../../components/FormField";
import { Loader, EmptyState } from "../../components/Loader";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { api, getErrorMessage } from "../../services/api";
import { titleCase, workerCategories } from "../../utils/constants";

export default function WorkerDirectory() {
  const [data, setData] = useState({ items: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", category: "", page: 1 });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: result } = await api.get("/users/workers", { params: filters });
      setData(result);
      setLoading(false);
    };
    load();
  }, [filters]);

  const startChat = async (workerId) => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await api.post("/chat/conversations", { targetUserId: workerId });
      navigate(`/${user.role}/chat`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <PageHeader title="Verified Worker Directory" description="Search approved local workers by category, skills, rating, and availability." />
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_240px]">
        <Field label="Search">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3 text-neutral-400" size={18} />
            <Input className="field pl-10" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} placeholder="Name, skill, phone" />
          </div>
        </Field>
        <Field label="Category">
          <Select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}>
            <option value="">All categories</option>
            {workerCategories.map((category) => <option key={category} value={category}>{titleCase(category)}</option>)}
          </Select>
        </Field>
      </div>
      {loading ? <Loader /> : data.items.length === 0 ? <EmptyState title="No workers found" /> : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.items.map((worker) => (
            <article key={worker._id} className="surface flex flex-col p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-black text-sm font-black text-white">
                  {worker.name?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-black">{worker.name}</h2>
                  <p className="text-sm text-neutral-500">{titleCase(worker.workerDetails?.category)}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge value={worker.workerDetails?.availability} />
                <span className="rounded-full border border-neutral-300 px-2.5 py-1 text-xs font-semibold">
                  {worker.workerDetails?.rating || 0}/5 rating
                </span>
                <span className="rounded-full border border-neutral-300 px-2.5 py-1 text-xs font-semibold">
                  {worker.workerDetails?.totalJobsCompleted || 0} jobs
                </span>
              </div>
              <p className="mt-4 min-h-12 text-sm leading-6 text-neutral-600">
                {(worker.workerDetails?.skills || []).join(", ") || "General Panchayat service support."}
              </p>
              <Button className="mt-5" variant="secondary" icon={MessageSquare} onClick={() => startChat(worker._id)}>
                Chat
              </Button>
            </article>
          ))}
        </div>
      )}
      <Pagination pagination={data.pagination} onPage={(page) => setFilters({ ...filters, page })} />
    </main>
  );
}
