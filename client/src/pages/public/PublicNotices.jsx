import { useEffect, useState } from "react";
import { PageHeader } from "../../components/PageHeader";
import { Loader, EmptyState } from "../../components/Loader";
import { StatusBadge } from "../../components/StatusBadge";
import { Pagination } from "../../components/Pagination";
import { Field, Input, Select } from "../../components/FormField";
import { api } from "../../services/api";

export default function PublicNotices() {
  const [data, setData] = useState({ items: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", priority: "", page: 1 });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: result } = await api.get("/notices", { params: filters });
      setData(result);
      setLoading(false);
    };
    load();
  }, [filters]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <PageHeader title="Panchayat Notice Board" description="Latest official notices, urgent announcements, and public documents." />
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
        <Field label="Search"><Input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} placeholder="Search notices" /></Field>
        <Field label="Priority">
          <Select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}>
            <option value="">All</option>
            <option value="urgent">Urgent</option>
            <option value="important">Important</option>
            <option value="normal">Normal</option>
          </Select>
        </Field>
      </div>
      {loading ? <Loader /> : data.items.length === 0 ? <EmptyState title="No notices found" /> : (
        <div className="grid gap-4">
          {data.items.map((notice) => (
            <article key={notice._id} className="surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black">{notice.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{notice.description}</p>
                </div>
                <StatusBadge value={notice.priority} />
              </div>
              {notice.attachment?.url ? (
                <a className="mt-4 inline-flex text-sm font-bold text-black underline" href={notice.attachment.url} target="_blank" rel="noreferrer">
                  View attachment
                </a>
              ) : null}
            </article>
          ))}
        </div>
      )}
      <Pagination pagination={data.pagination} onPage={(page) => setFilters({ ...filters, page })} />
    </main>
  );
}
