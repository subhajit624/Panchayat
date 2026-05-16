import {
  FileUp,
  Landmark,
  Upload,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import {
  Field,
  Input,
  Textarea,
} from "../../components/FormField";
import {
  Loader,
  EmptyState,
} from "../../components/Loader";
import { Modal } from "../../components/Modal";
import { PageHeader } from "../../components/PageHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { api, getErrorMessage } from "../../services/api";

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const [application, setApplication] = useState({
    note: "",
    documents: [],
  });

  const load = async () => {
    setLoading(true);

    const [schemeResponse, appResponse] =
      await Promise.all([
        api.get("/schemes"),
        api.get("/schemes/applications/me"),
      ]);

    setSchemes(schemeResponse.data.items);
    setApplications(appResponse.data.items);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const appliedSchemeIds = new Set(
    applications.map((item) => item.scheme?._id)
  );

  const apply = async () => {
    const data = new FormData();

    data.append("note", application.note);

    Array.from(application.documents).forEach(
      (file) => data.append("documents", file)
    );

    try {
      await api.post(
        `/schemes/${selected._id}/apply`,
        data
      );

      toast.success("Application submitted.");

      setSelected(null);

      setApplication({
        note: "",
        documents: [],
      });

      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <style>{`
        @keyframes sc-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes sc-float {
          0%,100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .sc-card {
          animation: sc-rise .6s cubic-bezier(.22,1,.36,1) both;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 45px rgba(0,0,0,.22);
        }

        .sc-float {
          animation: sc-float 3s ease-in-out infinite;
        }
      `}</style>

      <PageHeader
        title="Government Schemes"
        description="Browse active Panchayat schemes, upload documents, and track your application status."
      />

      {/* Schemes */}
      {schemes.length === 0 ? (
        <EmptyState title="No active schemes" />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {schemes.map((scheme) => (
            <article
              key={scheme._id}
              className="
                sc-card
                rounded-3xl
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-indigo-400/20
              "
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="
                      sc-float
                      grid
                      h-16
                      w-16
                      place-items-center
                      rounded-3xl
                      border
                      border-emerald-400/20
                      bg-gradient-to-br
                      from-emerald-500/20
                      to-teal-500/10
                      text-emerald-300
                    "
                  >
                    <Landmark size={28} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-white">
                      {scheme.title}
                    </h2>
                  </div>
                </div>

                {scheme.deadline ? (
                  <span className="rounded-2xl bg-white/8 px-4 py-2 text-xs font-bold text-neutral-300">
                    Deadline{" "}
                    {new Date(
                      scheme.deadline
                    ).toLocaleDateString()}
                  </span>
                ) : null}
              </div>

              <p className="text-sm leading-7 text-neutral-300">
                {scheme.description}
              </p>

              <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="font-black text-white">
                  Eligibility
                </p>

                <p className="mt-2 text-sm leading-7 text-neutral-300">
                  {scheme.eligibility}
                </p>
              </div>

              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-indigo-400/10 bg-indigo-500/8 p-4">
                <FileText
                  size={18}
                  className="mt-1 text-indigo-300"
                />

                <p className="text-sm text-neutral-300">
                  Documents:{" "}
                  {(scheme.requiredDocs || []).join(", ") ||
                    "As applicable"}
                </p>
              </div>

              <Button
                className="mt-5"
                icon={
                  appliedSchemeIds.has(scheme._id)
                    ? CheckCircle2
                    : FileUp
                }
                disabled={appliedSchemeIds.has(
                  scheme._id
                )}
                onClick={() => setSelected(scheme)}
              >
                {appliedSchemeIds.has(scheme._id)
                  ? "Applied"
                  : "Apply"}
              </Button>
            </article>
          ))}
        </div>
      )}

      {/* Applications */}
      <section className="mt-10">
        <div className="mb-6 flex items-center gap-4">
          <div
            className="
              grid
              h-16
              w-16
              place-items-center
              rounded-3xl
              border
              border-indigo-400/20
              bg-gradient-to-br
              from-indigo-500/20
              to-violet-500/10
              text-indigo-300
            "
          >
            <FileText size={28} />
          </div>

          <div>
            <h2 className="text-3xl font-black text-white">
              My Applications
            </h2>

            <p className="mt-1 text-sm text-neutral-400">
              Track approval progress
            </p>
          </div>
        </div>

        {applications.length === 0 ? (
          <EmptyState title="No applications yet" />
        ) : (
          <div className="grid gap-4">
            {applications.map((item) => (
              <div
                key={item._id}
                className="
                  sc-card
                  flex
                  flex-wrap
                  items-center
                  justify-between
                  gap-4
                  rounded-3xl
                  p-5
                "
              >
                <div>
                  <p className="text-lg font-black text-white">
                    {item.scheme?.title}
                  </p>

                  <p className="mt-2 text-sm text-neutral-400">
                    {item.remarks ||
                      "Awaiting review"}
                  </p>
                </div>

                <StatusBadge value={item.status} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      <Modal
        open={Boolean(selected)}
        title={`Apply: ${selected?.title || ""}`}
        onClose={() => setSelected(null)}
        footer={
          <Button onClick={apply}>
            Submit application
          </Button>
        }
      >
        <div className="space-y-5">
          <Field label="Note">
            <Textarea
              value={application.note}
              onChange={(e) =>
                setApplication({
                  ...application,
                  note: e.target.value,
                })
              }
            />
          </Field>

          <Field label="Documents">
            <label
              className="
                flex
                cursor-pointer
                items-center
                justify-center
                gap-3
                rounded-2xl
                border
                border-dashed
                border-white/15
                bg-white/5
                px-6
                py-6
                text-sm
                font-semibold
                text-neutral-300
                transition-all
                duration-300
                hover:border-indigo-400/20
                hover:bg-indigo-500/10
              "
            >
              <Upload size={18} />
              Upload Images / PDF

              <Input
                className="hidden"
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={(e) =>
                  setApplication({
                    ...application,
                    documents: e.target.files,
                  })
                }
              />
            </label>
          </Field>
        </div>
      </Modal>
    </>
  );
}