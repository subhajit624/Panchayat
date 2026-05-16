import {
  Star,
  Search,
  MessageSquare,
  Filter,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import {
  Field,
  Input,
  Select,
  Textarea,
} from "../../components/FormField";
import {
  Loader,
  EmptyState,
} from "../../components/Loader";
import { Modal } from "../../components/Modal";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { StatusBadge } from "../../components/StatusBadge";
import { api, getErrorMessage } from "../../services/api";
import {
  complaintCategories,
  titleCase,
} from "../../utils/constants";

export default function MyComplaints() {
  const [data, setData] = useState({
    items: [],
    pagination: null,
  });

  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    status: "",
    category: "",
    search: "",
    page: 1,
  });

  const [selected, setSelected] = useState(null);

  const [feedback, setFeedback] = useState({
    rating: 5,
    feedback: "",
  });

  const load = async () => {
    setLoading(true);

    const { data: result } = await api.get(
      "/complaints/mine",
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

  const confirm = async () => {
    try {
      await api.patch(
        `/complaints/${selected._id}/confirm`,
        feedback
      );

      toast.success("Complaint confirmed.");
      setSelected(null);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <style>{`
        @keyframes mc-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes mc-float {
          0%,100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .mc-card {
          animation: mc-rise .6s cubic-bezier(.22,1,.36,1) both;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 45px rgba(0,0,0,.22);
        }

        .mc-float {
          animation: mc-float 3s ease-in-out infinite;
        }
      `}</style>

      <PageHeader
        title="My Complaints"
        description="Search, filter, and confirm resolved complaints with worker feedback."
      />

      {/* Filters */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="mc-card rounded-3xl p-5">
          <Field label="Search">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
              />

              <Input
                className="pl-12"
                value={filters.search}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    search: e.target.value,
                    page: 1,
                  })
                }
              />
            </div>
          </Field>
        </div>

        <div
          className="mc-card rounded-3xl p-5"
          style={{ animationDelay: "100ms" }}
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

              {[
                "pending",
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

        <div
          className="mc-card rounded-3xl p-5"
          style={{ animationDelay: "200ms" }}
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
                <option
                  key={category}
                  value={category}
                >
                  {titleCase(category)}
                </option>
              ))}
            </Select>
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
                mc-card
                rounded-3xl
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-indigo-400/20
              "
            >
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <div className="mb-4 flex items-center gap-4">
                    <div
                      className="
                        mc-float
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
                      <MessageSquare size={22} />
                    </div>

                    <div>
                      <h2 className="text-2xl font-black text-white">
                        {complaint.title}
                      </h2>
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-neutral-300">
                    {complaint.description}
                  </p>
                </div>

                <div className="flex h-max flex-wrap gap-2">
                  <StatusBadge value={complaint.status} />
                  <StatusBadge value={complaint.priority} />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-5 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <Filter size={15} />
                  Category: {titleCase(complaint.category)}
                </div>

                <div className="flex items-center gap-2">
                  <User size={15} />
                  Worker:{" "}
                  {complaint.assignedWorker?.name ||
                    "Not assigned"}
                </div>
              </div>

              {complaint.image?.url ? (
                <img
                  src={complaint.image.url}
                  alt=""
                  className="
                    mt-5
                    max-h-72
                    w-full
                    rounded-3xl
                    border
                    border-white/10
                    object-cover
                  "
                />
              ) : null}

              {complaint.status === "completed" ? (
                <Button
                  className="mt-5"
                  icon={Star}
                  onClick={() =>
                    setSelected(complaint)
                  }
                >
                  Confirm completion
                </Button>
              ) : null}
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

      {/* Feedback Modal */}
      <Modal
        open={Boolean(selected)}
        title="Rate worker"
        onClose={() => setSelected(null)}
        footer={
          <Button
            onClick={confirm}
            icon={Star}
          >
            Submit feedback
          </Button>
        }
      >
        <div className="space-y-5">
          <Field label="Rating">
            <Select
              value={feedback.rating}
              onChange={(e) =>
                setFeedback({
                  ...feedback,
                  rating: Number(e.target.value),
                })
              }
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option
                  key={rating}
                  value={rating}
                >
                  {rating} stars
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Feedback">
            <Textarea
              value={feedback.feedback}
              onChange={(e) =>
                setFeedback({
                  ...feedback,
                  feedback: e.target.value,
                })
              }
            />
          </Field>
        </div>
      </Modal>
    </>
  );
}