import { Check, X } from "lucide-react";
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
  const [filters, setFilters] = useState({ status: "", type: "", page: 1 });

  const load = async () => {
    setLoading(true);
    const { data: result } = await api.get("/certificates", { params: filters });
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filters]);

  const decide = async (certificate, status) => {
    try {
      await api.patch(`/certificates/${certificate._id}`, { status, remarks: status === "approved" ? "Approved by Panchayat admin." : "Rejected by Panchayat admin." });
      toast.success("Certificate request updated.");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <PageHeader title="Certificates" description="Review document requests and approve or reject certificate forwarding applications." />
      <div className="mb-5 grid gap-3 md:grid-cols-2">
        <Field label="Status">
          <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
        </Field>
        <Field label="Type">
          <Select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}>
            <option value="">All</option>
            {certificateTypes.map((type) => <option key={type} value={type}>{titleCase(type)}</option>)}
          </Select>
        </Field>
      </div>
      {loading ? <Loader /> : data.items.length === 0 ? <EmptyState title="No certificate requests" /> : (
        <div className="grid gap-4">
          {data.items.map((certificate) => (
            <article key={certificate._id} className="surface p-5">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black">{titleCase(certificate.type)}</h2>
                  <p className="mt-1 text-sm text-neutral-500">{certificate.citizen?.name} - Ward {certificate.citizen?.wardNumber}</p>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{certificate.purpose || "No purpose provided"}</p>
                </div>
                <StatusBadge value={certificate.status} />
              </div>
              {certificate.documents?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {certificate.documents.map((doc) => <a key={doc.publicId || doc.url} href={doc.url} target="_blank" rel="noreferrer" className="text-sm font-bold underline">Document</a>)}
                </div>
              ) : null}
              {certificate.status === "pending" ? (
                <div className="mt-4 flex gap-2">
                  <Button icon={Check} onClick={() => decide(certificate, "approved")}>Approve</Button>
                  <Button variant="secondary" icon={X} onClick={() => decide(certificate, "rejected")}>Reject</Button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
      <Pagination pagination={data.pagination} onPage={(page) => setFilters({ ...filters, page })} />
    </>
  );
}
