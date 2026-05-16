import {
  Check,
  Plus,
  X,
  Landmark,
  Archive,
  FileText,
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
import { PageHeader } from "../../components/PageHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { api, getErrorMessage } from "../../services/api";

const initial = {
  title: "",
  description: "",
  eligibility: "",
  deadline: "",
  requiredDocs: "",
};

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initial);
  const [statusFilter, setStatusFilter] = useState("");

  const load = async () => {
    setLoading(true);

    const [schemeResponse, appResponse] = await Promise.all([
      api.get("/schemes"),
      api.get("/schemes/applications", {
        params: { status: statusFilter },
      }),
    ]);

    setSchemes(schemeResponse.data.items);
    setApplications(appResponse.data.items);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const update = (event) =>
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

  const create = async (event) => {
    event.preventDefault();

    try {
      await api.post("/schemes", form);
      toast.success("Scheme created.");
      setForm(initial);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const archive = async (scheme) => {
    try {
      await api.delete(`/schemes/${scheme._id}`);
      toast.success("Scheme archived.");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const decide = async (application, status) => {
    try {
      await api.patch(`/schemes/applications/${application._id}`, {
        status,
        remarks:
          status === "approved"
            ? "Approved by Panchayat admin."
            : "Rejected by Panchayat admin.",
      });

      toast.success("Application updated.");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <style>{`
        @keyframes as-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes as-float {
          0%,100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .as-rise {
          animation: as-rise .6s cubic-bezier(.22,1,.36,1) both;
        }

        .as-card {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 45px rgba(0,0,0,.22);
        }

        .as-float {
          animation: as-float 3s ease-in-out infinite;
        }
      `}</style>

      <PageHeader
        title="Schemes"
        description="Create government schemes, define eligibility and documents, and approve or reject citizen applications."
      />

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        {/* Create Scheme */}
        <form
          onSubmit={create}
          className="
            as-card
            as-rise
            h-max
            rounded-3xl
            p-6
            space-y-5
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                as-float
                grid
                h-14
                w-14
                place-items-center
                rounded-2xl
                border
                border-indigo-400/20
                bg-gradient-to-br
                from-indigo-500/20
                to-violet-500/10
                text-indigo-300
              "
            >
              <Landmark size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">
                Add Scheme
              </h2>

              <p className="mt-1 text-sm text-neutral-400">
                Publish welfare opportunities
              </p>
            </div>
          </div>

          <Field label="Title">
            <Input
              name="title"
              value={form.title}
              onChange={update}
              required
            />
          </Field>

          <Field label="Description">
            <Textarea
              name="description"
              value={form.description}
              onChange={update}
              required
            />
          </Field>

          <Field label="Eligibility">
            <Textarea
              name="eligibility"
              value={form.eligibility}
              onChange={update}
              required
            />
          </Field>

          <Field label="Deadline">
            <Input
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={update}
            />
          </Field>

          <Field label="Required documents">
            <Input
              name="requiredDocs"
              value={form.requiredDocs}
              onChange={update}
              placeholder="Aadhaar, income proof"
            />
          </Field>

          <Button type="submit" icon={Plus}>
            Create scheme
          </Button>
        </form>

        {/* Right Side */}
        <section className="space-y-6">
          {/* Active Schemes */}
          <div
            className="
              as-card
              as-rise
              rounded-3xl
              p-6
            "
          >
            <h2 className="mb-5 text-2xl font-black text-white">
              Active Schemes
            </h2>

            {loading ? (
              <Loader />
            ) : schemes.length === 0 ? (
              <EmptyState title="No schemes" />
            ) : (
              <div className="grid gap-4">
                {schemes.map((scheme) => (
                  <div
                    key={scheme._id}
                    className="
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/5
                      p-5
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-indigo-400/20
                    "
                  >
                    <div className="flex flex-wrap justify-between gap-4">
                      <div>
                        <p className="text-lg font-black text-white">
                          {scheme.title}
                        </p>

                        <p className="mt-2 text-sm leading-7 text-neutral-300">
                          {scheme.description}
                        </p>
                      </div>

                      <Button
                        variant="danger"
                        icon={Archive}
                        onClick={() => archive(scheme)}
                      >
                        Archive
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Applications */}
          <div
            className="
              as-card
              as-rise
              rounded-3xl
              p-6
            "
          >
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">
                  Applications
                </h2>

                <p className="mt-1 text-sm text-neutral-400">
                  Review citizen submissions
                </p>
              </div>

              <div className="w-full md:w-52">
                <Select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                >
                  <option value="">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </Select>
              </div>
            </div>

            {applications.length === 0 ? (
              <EmptyState title="No applications" />
            ) : (
              <div className="grid gap-4">
                {applications.map((application) => (
                  <div
                    key={application._id}
                    className="
                      rounded-2xl
                      border
                      border-white/10
                      bg-white/5
                      p-5
                      transition-all
                      duration-300
                      hover:border-indigo-400/20
                    "
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div
                          className="
                            grid
                            h-12
                            w-12
                            place-items-center
                            rounded-2xl
                            border
                            border-indigo-400/20
                            bg-gradient-to-br
                            from-indigo-500/20
                            to-violet-500/10
                            text-indigo-300
                          "
                        >
                          <FileText size={20} />
                        </div>

                        <div>
                          <p className="font-black text-white">
                            {application.scheme?.title}
                          </p>

                          <p className="mt-1 text-sm text-neutral-400">
                            {application.citizen?.name} — Ward{" "}
                            {application.citizen?.wardNumber}
                          </p>
                        </div>
                      </div>

                      <StatusBadge value={application.status} />
                    </div>

                    {application.status === "pending" ? (
                      <div className="mt-5 flex gap-3">
                        <Button
                          icon={Check}
                          onClick={() =>
                            decide(application, "approved")
                          }
                        >
                          Approve
                        </Button>

                        <Button
                          variant="danger"
                          icon={X}
                          onClick={() =>
                            decide(application, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}