import {
  CheckCircle2,
  Play,
  Briefcase,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import {
  Field,
  Select,
} from "../../components/FormField";
import {
  EmptyState,
  Loader,
} from "../../components/Loader";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { StatusBadge } from "../../components/StatusBadge";
import { api, getErrorMessage } from "../../services/api";
import { titleCase } from "../../utils/constants";

export default function AssignedTasks() {
  const [data, setData] = useState({
    items: [],
    pagination: null,
  });

  const [filters, setFilters] = useState({
    status: "",
    page: 1,
  });

  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);

    const { data: result } = await api.get(
      "/complaints/assigned",
      {
        params: filters,
      }
    );

    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filters]);

  const updateStatus = async (complaint, status) => {
    try {
      await api.patch(
        `/complaints/${complaint._id}/status`,
        { status }
      );

      toast.success("Status updated.");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <style>{`
        @keyframes at-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes at-float {
          0%,100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .at-card {
          animation: at-rise .6s cubic-bezier(.22,1,.36,1) both;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 45px rgba(0,0,0,.22);
        }

        .at-float {
          animation: at-float 3s ease-in-out infinite;
        }
      `}</style>

      <PageHeader
        title="Assigned Tasks"
        description="Move assigned complaints from in progress to completed after field work is done."
      />

      {/* Filter */}
      <div className="mb-6 max-w-sm">
        <div className="at-card rounded-3xl p-5">
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

              {[
                "in-progress",
                "completed",
                "confirmed",
              ].map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {titleCase(status)}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      {/* Tasks */}
      {loading ? (
        <Loader />
      ) : data.items.length === 0 ? (
        <EmptyState title="No assigned tasks" />
      ) : (
        <div className="grid gap-5">
          {data.items.map((complaint) => (
            <article
              key={complaint._id}
              className="
                at-card
                rounded-3xl
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-indigo-400/20
              "
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex gap-5">
                  <div
                    className="
                      at-float
                      grid
                      h-16
                      w-16
                      shrink-0
                      place-items-center
                      rounded-3xl
                      border
                      border-amber-400/20
                      bg-gradient-to-br
                      from-amber-500/20
                      to-orange-500/10
                      text-amber-300
                    "
                  >
                    <Briefcase size={26} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-white">
                      {complaint.title}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-neutral-300">
                      {complaint.description}
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm text-neutral-400">
                      <User size={15} />
                      Citizen:{" "}
                      {complaint.citizenId?.name} —
                      Ward {complaint.wardNumber}
                    </div>
                  </div>
                </div>

                <StatusBadge value={complaint.status} />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {complaint.status === "pending" ? (
                  <Button
                    icon={Play}
                    onClick={() =>
                      updateStatus(
                        complaint,
                        "in-progress"
                      )
                    }
                  >
                    Start work
                  </Button>
                ) : null}

                {complaint.status === "in-progress" ? (
                  <Button
                    icon={CheckCircle2}
                    onClick={() =>
                      updateStatus(
                        complaint,
                        "completed"
                      )
                    }
                  >
                    Mark completed
                  </Button>
                ) : null}
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
    </>
  );
}