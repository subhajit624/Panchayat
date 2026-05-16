import { useEffect, useState } from "react";
import { Bell, ExternalLink, FileText, AlertTriangle, Info } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { Loader, EmptyState } from "../../components/Loader";
import { StatusBadge } from "../../components/StatusBadge";
import { Pagination } from "../../components/Pagination";
import { Field, Input, Select } from "../../components/FormField";
import { api } from "../../services/api";

/* priority meta — colours + icons shown on each card */
const PRIORITY_META = {
  urgent:    { color: "#ef4444", dim: "rgba(239,68,68,.12)",    border: "rgba(239,68,68,.28)",    Icon: AlertTriangle, label: "Urgent"    },
  important: { color: "#f59e0b", dim: "rgba(245,158,11,.12)",   border: "rgba(245,158,11,.28)",   Icon: Bell,          label: "Important" },
  normal:    { color: "#6366f1", dim: "rgba(99,102,241,.12)",   border: "rgba(99,102,241,.28)",   Icon: Info,          label: "Normal"    },
};
const getPriority = (val) => PRIORITY_META[val] ?? PRIORITY_META.normal;

export default function PublicNotices() {
  const [data,    setData]    = useState({ items: [], pagination: null });
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
    <>
      <style>{`
        /* ── entrance ── */
        @keyframes pn-rise {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .pn-rise  { animation: pn-rise .55s cubic-bezier(.22,1,.36,1) both; }
        .pn-d1    { animation-delay:.04s; }
        .pn-d2    { animation-delay:.12s; }
        .pn-d3    { animation-delay:.20s; }

        /* ── card ── */
        .pn-card {
          border:1px solid rgba(255,255,255,.07);
          background:rgba(255,255,255,.025);
          border-radius:14px;
          backdrop-filter:blur(14px);
          transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease;
          animation: pn-rise .5s cubic-bezier(.22,1,.36,1) both;
        }
        .pn-card:hover {
          transform:translateY(-3px);
          box-shadow:0 16px 48px rgba(0,0,0,.35);
        }

        /* ── priority stripe ── */
        .pn-stripe {
          width:4px; border-radius:99px; flex-shrink:0; align-self:stretch;
        }

        /* ── attachment link ── */
        .pn-attach {
          display:inline-flex; align-items:center; gap:.4rem;
          font-size:.78rem; font-weight:700;
          color:#a5b4fc;
          text-decoration:none;
          padding:.35rem .7rem;
          border-radius:7px;
          border:1px solid rgba(99,102,241,.22);
          background:rgba(99,102,241,.08);
          transition:background .2s ease, border-color .2s ease, color .2s ease;
        }
        .pn-attach:hover {
          background:rgba(99,102,241,.18);
          border-color:rgba(99,102,241,.40);
          color:#fff;
        }

        /* ── filter bar ── */
        .pn-filter-bar {
          border:1px solid rgba(255,255,255,.07);
          background:rgba(255,255,255,.025);
          border-radius:14px;
          backdrop-filter:blur(14px);
          padding:1.1rem 1.25rem;
        }

        /* ── page icon ── */
        .pn-page-icon {
          display:grid; place-items:center;
          width:46px; height:46px; border-radius:12px; flex-shrink:0;
          background:linear-gradient(135deg,rgba(99,102,241,.18),rgba(79,70,229,.06));
          border:1px solid rgba(99,102,241,.25);
          box-shadow:0 0 18px rgba(99,102,241,.14);
        }

        /* ── priority icon wrap ── */
        .pn-picon {
          display:grid; place-items:center;
          width:38px; height:38px; border-radius:10px; flex-shrink:0;
        }

        /* ── section label ── */
        .pn-label {
          font-size:.68rem; font-weight:700;
          letter-spacing:.14em; text-transform:uppercase; display:block;
        }
      `}</style>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* ── page header ── */}
        <div className="pn-rise pn-d1 mb-8 flex items-center gap-4">
          <div className="pn-page-icon">
            <Bell size={21} className="text-indigo-400" />
          </div>
          <div>
            <span className="pn-label text-indigo-400">Public board</span>
            <PageHeader
              title="Panchayat Notice Board"
              description="Latest official notices, urgent announcements, and public documents."
            />
          </div>
        </div>

        {/* ── filter bar ── */}
        <div className="pn-rise pn-d2 pn-filter-bar mb-6 grid gap-3 md:grid-cols-[1fr_220px]">
          <Field label="Search">
            <Input
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              placeholder="Search notices…"
            />
          </Field>
          <Field label="Priority">
            <Select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}
            >
              <option value="">All priorities</option>
              <option value="urgent">Urgent</option>
              <option value="important">Important</option>
              <option value="normal">Normal</option>
            </Select>
          </Field>
        </div>

        {/* ── content ── */}
        <div className="pn-rise pn-d3">
          {loading ? (
            <Loader />
          ) : data.items.length === 0 ? (
            <EmptyState title="No notices found" />
          ) : (
            <div className="grid gap-4">
              {data.items.map((notice, i) => {
                const pm = getPriority(notice.priority);
                const PIcon = pm.Icon;
                return (
                  <article
                    key={notice._id}
                    className="pn-card"
                    style={{ animationDelay: `${0.05 + i * 0.06}s` }}
                  >
                    <div className="flex gap-4 p-5">
                      {/* priority stripe */}
                      <div className="pn-stripe" style={{ background: pm.color }} />

                      {/* priority icon */}
                      <div
                        className="pn-picon"
                        style={{ background: pm.dim, border: `1px solid ${pm.border}` }}
                      >
                        <PIcon size={17} style={{ color: pm.color }} />
                      </div>

                      {/* body */}
                      <div className="flex flex-1 flex-col gap-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h2 className="text-base font-black text-white sm:text-lg leading-snug">
                              {notice.title}
                            </h2>
                            <p className="mt-1.5 text-sm leading-6 text-neutral-400">
                              {notice.description}
                            </p>
                          </div>
                          <StatusBadge value={notice.priority} />
                        </div>

                        {/* attachment */}
                        {notice.attachment?.url ? (
                          <div>
                            <a
                              className="pn-attach"
                              href={notice.attachment.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <FileText size={13} />
                              View attachment
                              <ExternalLink size={11} />
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* ── pagination ── */}
        <div className="mt-6">
          <Pagination
            pagination={data.pagination}
            onPage={(page) => setFilters({ ...filters, page })}
          />
        </div>
      </main>
    </>
  );
}