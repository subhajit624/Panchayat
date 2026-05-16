import { MessageSquare, Search, Star, Briefcase, Users } from "lucide-react";
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
    <>
      <style>{`
        @keyframes wd-rise {
          from {
            opacity: 0;
            transform: translateY(22px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes wd-shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        @keyframes wd-float {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-14px) scale(1.04); }
        }

        .wd-rise {
          animation: wd-rise .65s cubic-bezier(.22,1,.36,1) both;
        }

        .wd-gradient-text {
          background: linear-gradient(120deg,#fff 0%,#a5b4fc 50%,#34d399 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: wd-shimmer 5s linear infinite;
        }

        .wd-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
          animation: wd-float 10s ease-in-out infinite;
        }

        .wd-card {
          background: linear-gradient(135deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
          border: 1px solid rgba(255,255,255,.08);
          backdrop-filter: blur(12px);
          border-radius: 18px;
          transition: all .3s ease;
        }

        .wd-card:hover {
          transform: translateY(-6px);
          border-color: rgba(99,102,241,.35);
          box-shadow: 0 12px 30px rgba(0,0,0,.35);
        }

        .wd-filter {
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 16px;
          padding: 1.2rem;
          backdrop-filter: blur(12px);
        }

        .wd-chat-btn {
          background: linear-gradient(135deg,#6366f1,#4f46e5) !important;
          color: white !important;
          border: none !important;
          box-shadow: 0 4px 18px rgba(99,102,241,.35);
          transition: all .25s ease !important;
        }

        .wd-chat-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(99,102,241,.45);
        }

        .wd-avatar {
          background: linear-gradient(135deg,#6366f1,#4f46e5);
          box-shadow: 0 0 20px rgba(99,102,241,.3);
        }

        .wd-pill {
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.03);
          color: #d4d4d8;
        }
      `}</style>

      <main className="mx-auto max-w-7xl px-4 py-10">

        {/* Hero Section */}
        <div
          className="wd-rise relative mb-8 overflow-hidden rounded-3xl px-8 py-10 text-white"
          style={{
            background: "linear-gradient(135deg,#0d0d1e 0%,#0a0a16 100%)",
            border: "1px solid rgba(255,255,255,.07)"
          }}
        >
          <div
            className="wd-blob"
            style={{
              top: "-40px",
              right: "-20px",
              width: "260px",
              height: "260px",
              background: "rgba(99,102,241,.14)"
            }}
          />

          <div
            className="wd-blob"
            style={{
              bottom: "-40px",
              left: "-20px",
              width: "220px",
              height: "220px",
              background: "rgba(52,211,153,.08)",
              animationDelay: "5s"
            }}
          />

          <div className="relative z-10 flex items-center gap-5">
            <div
              className="grid place-items-center rounded-2xl"
              style={{
                width: "60px",
                height: "60px",
                background: "linear-gradient(135deg,rgba(99,102,241,.22),rgba(79,70,229,.08))",
                border: "1px solid rgba(99,102,241,.28)"
              }}
            >
              <Users className="text-indigo-400" size={28} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                Worker Directory
              </p>
              <h1 className="mt-1 text-3xl font-black leading-tight md:text-4xl">
                Find trusted{" "}
                <span className="wd-gradient-text">verified workers</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-neutral-400 md:text-base">
                Search approved local workers by category, skills, ratings, and availability.
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="wd-filter mb-8 wd-rise">
          <div className="grid gap-4 md:grid-cols-[1fr_260px]">
            <Field label="Search">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-3 text-neutral-400"
                  size={18}
                />
                <Input
                  className="field pl-10"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      search: e.target.value,
                      page: 1
                    })
                  }
                  placeholder="Name, skill, phone"
                />
              </div>
            </Field>

            <Field label="Category">
              <Select
                value={filters.category}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    category: e.target.value,
                    page: 1
                  })
                }
              >
                <option value="">All categories</option>
                {workerCategories.map((category) => (
                  <option key={category} value={category}>
                    {titleCase(category)}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <Loader />
        ) : data.items.length === 0 ? (
          <EmptyState title="No workers found" />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((worker) => (
              <article key={worker._id} className="wd-card flex flex-col p-6 wd-rise">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className="wd-avatar grid h-14 w-14 place-items-center rounded-2xl text-sm font-black text-white">
                    {worker.name?.slice(0, 2).toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-black text-white">
                      {worker.name}
                    </h2>
                    <p className="text-sm text-neutral-400">
                      {titleCase(worker.workerDetails?.category)}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <StatusBadge value={worker.workerDetails?.availability} />

                  <span className="wd-pill rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1">
                    <Star size={13} />
                    {worker.workerDetails?.rating || 0}/5
                  </span>

                  <span className="wd-pill rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1">
                    <Briefcase size={13} />
                    {worker.workerDetails?.totalJobsCompleted || 0} jobs
                  </span>
                </div>

                {/* Skills */}
                <div className="mt-5 min-h-[70px]">
                  <p className="text-sm leading-6 text-neutral-300">
                    {(worker.workerDetails?.skills || []).join(", ") ||
                      "General Panchayat service support."}
                  </p>
                </div>

                {/* Chat Button */}
                <Button
                  className="wd-chat-btn mt-6"
                  icon={MessageSquare}
                  onClick={() => startChat(worker._id)}
                >
                  Start Chat
                </Button>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="mt-10">
          <Pagination
            pagination={data.pagination}
            onPage={(page) => setFilters({ ...filters, page })}
          />
        </div>
      </main>
    </>
  );
}