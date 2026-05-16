import { Check, X, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import { Field, Select } from "../../components/FormField";
import { Loader, EmptyState } from "../../components/Loader";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { StatusBadge } from "../../components/StatusBadge";
import { api, getErrorMessage } from "../../services/api";
import { certificateTypes, titleCase } from "../../utils/constants";

export default function AdminCertificates() {
  const [data, setData] = useState({ items: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    page: 1,
  });

  const load = async () => {
    setLoading(true);
    const { data: result } = await api.get("/certificates", {
      params: filters,
    });
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filters]);

  const decide = async (certificate, status) => {
    try {
      await api.patch(`/certificates/${certificate._id}`, {
        status,
        remarks:
          status === "approved"
            ? "Approved by Panchayat admin."
            : "Rejected by Panchayat admin.",
      });

      toast.success("Certificate request updated.");
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
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.03);
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
        title="Certificates"
        description="Review document requests and approve or reject certificate forwarding applications."
      />

      {/* Filters */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div className="ac-card ac-rise rounded-3xl p-5">
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Select>
          </Field>
        </div>

        <div
          className="ac-card ac-rise rounded-3xl p-5"
          style={{ animationDelay: "120ms" }}
        >
          <Field label="Type">
            <Select
              value={filters.type}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  type: e.target.value,
                  page: 1,
                })
              }
            >
              <option value="">All</option>

              {certificateTypes.map((type) => (
                <option key={type} value={type}>
                  {titleCase(type)}
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
        <EmptyState title="No certificate requests" />
      ) : (
        <div className="grid gap-5">
          {data.items.map((certificate) => (
            <article
              key={certificate._id}
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
              {/* Top */}
              <div className="flex flex-wrap justify-between gap-4">
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
                      border-indigo-400/20
                      bg-gradient-to-br
                      from-indigo-500/20
                      to-violet-500/10
                      text-indigo-300
                    "
                  >
                    <FileText size={22} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-white">
                      {titleCase(certificate.type)}
                    </h2>

                    <p className="mt-1 text-sm text-neutral-400">
                      {certificate.citizen?.name} — Ward{" "}
                      {certificate.citizen?.wardNumber}
                    </p>

                    <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-300">
                      {certificate.purpose || "No purpose provided"}
                    </p>
                  </div>
                </div>

                <StatusBadge value={certificate.status} />
              </div>

              {/* Documents */}
              {certificate.documents?.length ? (
                <div className="mt-5 flex flex-wrap gap-3">
                  {certificate.documents.map((doc) => (
                    <a
                      key={doc.publicId || doc.url}
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        rounded-2xl
                        border
                        border-indigo-400/20
                        bg-indigo-500/10
                        px-4
                        py-2
                        text-sm
                        font-bold
                        text-indigo-300
                        transition-all
                        duration-300
                        hover:bg-indigo-500/20
                        hover:text-white
                      "
                    >
                      View Document
                    </a>
                  ))}
                </div>
              ) : null}

              {/* Actions */}
              {certificate.status === "pending" ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    icon={Check}
                    onClick={() => decide(certificate, "approved")}
                  >
                    Approve
                  </Button>

                  <Button
                    variant="danger"
                    icon={X}
                    onClick={() => decide(certificate, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
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
    </>
  );
}