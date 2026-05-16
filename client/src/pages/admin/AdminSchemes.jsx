import { Check, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import { Field, Input, Select, Textarea } from "../../components/FormField";
import { Loader, EmptyState } from "../../components/Loader";
import { PageHeader } from "../../components/PageHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { api, getErrorMessage } from "../../services/api";

const initial = { title: "", description: "", eligibility: "", deadline: "", requiredDocs: "" };

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
      api.get("/schemes/applications", { params: { status: statusFilter } }),
    ]);
    setSchemes(schemeResponse.data.items);
    setApplications(appResponse.data.items);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });

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
      await api.patch(`/schemes/applications/${application._id}`, { status, remarks: status === "approved" ? "Approved by Panchayat admin." : "Rejected by Panchayat admin." });
      toast.success("Application updated.");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <PageHeader title="Schemes" description="Create government schemes, define eligibility and documents, and approve or reject citizen applications." />
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={create} className="surface h-max space-y-4 p-5">
          <h2 className="text-lg font-black">Add scheme</h2>
          <Field label="Title"><Input name="title" value={form.title} onChange={update} required /></Field>
          <Field label="Description"><Textarea name="description" value={form.description} onChange={update} required /></Field>
          <Field label="Eligibility"><Textarea name="eligibility" value={form.eligibility} onChange={update} required /></Field>
          <Field label="Deadline"><Input name="deadline" type="date" value={form.deadline} onChange={update} /></Field>
          <Field label="Required documents"><Input name="requiredDocs" value={form.requiredDocs} onChange={update} placeholder="Aadhaar, income proof" /></Field>
          <Button type="submit" icon={Plus}>Create scheme</Button>
        </form>
        <section className="space-y-6">
          <div>
            <h2 className="mb-4 text-lg font-black">Active schemes</h2>
            {loading ? <Loader /> : schemes.length === 0 ? <EmptyState title="No schemes" /> : (
              <div className="grid gap-3">
                {schemes.map((scheme) => (
                  <div key={scheme._id} className="surface p-4">
                    <div className="flex flex-wrap justify-between gap-3">
                      <div>
                        <p className="font-bold">{scheme.title}</p>
                        <p className="mt-1 text-sm text-neutral-500">{scheme.description}</p>
                      </div>
                      <Button variant="secondary" onClick={() => archive(scheme)}>Archive</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <h2 className="text-lg font-black">Applications</h2>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Select>
            </div>
            {applications.length === 0 ? <EmptyState title="No applications" /> : (
              <div className="grid gap-3">
                {applications.map((application) => (
                  <div key={application._id} className="surface p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-bold">{application.scheme?.title}</p>
                        <p className="text-sm text-neutral-500">{application.citizen?.name} - Ward {application.citizen?.wardNumber}</p>
                      </div>
                      <StatusBadge value={application.status} />
                    </div>
                    {application.status === "pending" ? (
                      <div className="mt-3 flex gap-2">
                        <Button icon={Check} onClick={() => decide(application, "approved")}>Approve</Button>
                        <Button variant="secondary" icon={X} onClick={() => decide(application, "rejected")}>Reject</Button>
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
