import { UserRoundCheck, AlertTriangle } from "lucide-react";
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
import {
  complaintCategories,
  titleCase,
  workerCategories,
} from "../../utils/constants";

export default function AdminComplaints() {
  const [data, setData] = useState({ items: [], pagination: null });
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
    wardNumber: "",
    page: 1,
  });
  const [assigning, setAssigning] = useState(null);
  const [workerId, setWorkerId] = useState("");
  const [workerCategory, setWorkerCategory] = useState("");

  const load = async () => {
    setLoading(true);
    const { data: result } = await api.get("/complaints", {
      params: filters,
    });
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filters]);

  useEffect(() => {
    api
      .get("/users/workers", {
        params: {
          limit: 50,
          category: workerCategory,
        },
      })
      .then(({ data }) => setWorkers(data.items));
  }, [workerCategory]);

  const assign = async () => {
    try {
      await api.patch(`/complaints/${assigning._id}/assign`, {
        workerId,
      });

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
      <style>{`
        @keyframes ac-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes ac-float {
          0%,100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .ac-rise {
          animation: ac-rise .6s cubic-bezier(.22,1,.36,1) both;
        }

        .ac-card {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 45px rgba(0,0,0,.22);
        }

        .ac-icon-float {
          animation: ac-float 3s ease-in-out infinite;
        }
      `}</style>

      <PageHeader
        title="Complaints"
        description="Filter ward complaints, assign approved workers, and monitor resolution progress."
      />

      {/* Filters */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="ac-card ac-rise rounded-3xl p-5">
          <Field label="Search">
            <Input
              value={filters.search}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  search: e.target.value,
                  page: 1,
                })
              }
            />
          </Field>
        </div>

        <div
          className="ac-card ac-rise rounded-3xl p-5"
          style={{ animationDelay: "80ms" }}
        >
          <Field label="Status">
            <Select
              value={filters.status}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value,
                  page: 1,
                })
              }
            >
              <option value="">All</option>

              {["pending", "in-progress", "completed", "confirmed"].map(
                (status) => (
                  <option key={status} value={status}>
                    {titleCase(status)}
                  </option>
                )
              )}
            </Select>
          </Field>
        </div>

        <div
          className="ac-card ac-rise rounded-3xl p-5"
          style={{ animationDelay: "140ms" }}
        >
          <Field label="Category">
            <Select
              value={filters.category}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  category: e.target.value,
                  page: 1,
                })
              }
            >
              <option value="">All</option>

              {complaintCategories.map((category) => (
                <option key={category} value={category}>
                  {titleCase(category)}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <div
          className="ac-card ac-rise rounded-3xl p-5"
          style={{ animationDelay: "200ms" }}
        >
          <Field label="Ward">
            <Input
              value={filters.wardNumber}
              type="number"
              min="1"
              onChange={(e) =>
                setFilters({
                  ...filters,
                  wardNumber: e.target.value,
                  page: 1,
                })
              }
            />
          </Field>
        </div>
      </div>

      {/* Complaints */}
      {loading ? (
        <Loader />
      ) : data.items.length === 0 ? (
        <EmptyState title="No complaints found" />
      ) : (
        <div className="grid gap-5">
          {data.items.map((complaint) => (
            <article
              key={complaint._id}
              className="
                ac-card
                ac-rise
                group
                rounded-3xl
                p-6
                transition-all
                duration-300
                hover:-translate-y-1.5
                hover:border-indigo-400/20
              "
            >
              <div className="flex flex-wrap justify-between gap-5">
                {/* Left */}
                <div className="flex gap-4">
                  <div
                    className="
                      ac-icon-float
                      grid
                      h-14
                      w-14
                      place-items-center
                      rounded-2xl
                      border
                      border-amber-400/20
                      bg-gradient-to-br
                      from-amber-500/20
                      to-orange-500/10
                      text-amber-300
                    "
                  >
                    <AlertTriangle size={22} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-white">
                      {complaint.title}
                    </h2>

                    <p className="mt-3 max-w-4xl text-sm leading-7 text-neutral-300">
                      {complaint.description}
                    </p>

                    <p className="mt-3 text-sm text-neutral-400">
                      Citizen: {complaint.citizenId?.name} — Ward{" "}
                      {complaint.wardNumber} —{" "}
                      {titleCase(complaint.category)}
                    </p>
                  </div>
                </div>

                {/* Right */}
                <div className="flex h-max flex-wrap gap-2">
                  <StatusBadge value={complaint.status} />
                  <StatusBadge value={complaint.priority} />
                </div>
              </div>

              {/* Bottom */}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <span className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-neutral-300">
                  Worker:{" "}
                  <span className="font-black text-white">
                    {complaint.assignedWorker?.name || "Not assigned"}
                  </span>
                </span>

                <Button
                  variant="secondary"
                  icon={UserRoundCheck}
                  onClick={() => setAssigning(complaint)}
                >
                  Assign worker
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Pagination
        pagination={data.pagination}
        onPage={(page) =>
          setFilters({
            ...filters,
            page,
          })
        }
      />

      {/* Modal */}
      <Modal
        open={Boolean(assigning)}
        title="Assign worker"
        onClose={() => setAssigning(null)}
        footer={
          <Button
            onClick={assign}
            disabled={!workerId}
          >
            Assign
          </Button>
        }
      >
        <div className="space-y-5">
          <Field label="Filter by worker category">
            <Select
              value={workerCategory}
              onChange={(e) =>
                setWorkerCategory(e.target.value)
              }
            >
              <option value="">All workers</option>

              {workerCategories.map((category) => (
                <option key={category} value={category}>
                  {titleCase(category)}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Worker">
            <Select
              value={workerId}
              onChange={(e) =>
                setWorkerId(e.target.value)
              }
            >
              <option value="">Select worker</option>

              {workers.map((worker) => (
                <option key={worker._id} value={worker._id}>
                  {worker.name} —{" "}
                  {titleCase(worker.workerDetails?.category)} —{" "}
                  {worker.workerDetails?.rating || 0}/5
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Modal>
    </>
  );
}