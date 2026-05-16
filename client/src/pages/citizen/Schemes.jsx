import { FileUp } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import { Field, Input, Textarea } from "../../components/FormField";
import { Loader, EmptyState } from "../../components/Loader";
import { Modal } from "../../components/Modal";
import { PageHeader } from "../../components/PageHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { api, getErrorMessage } from "../../services/api";

export default function Schemes() {
  const [schemes, setSchemes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [application, setApplication] = useState({ note: "", documents: [] });

  const load = async () => {
    setLoading(true);
    const [schemeResponse, appResponse] = await Promise.all([
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

  const appliedSchemeIds = new Set(applications.map((item) => item.scheme?._id));

  const apply = async () => {
    const data = new FormData();
    data.append("note", application.note);
    Array.from(application.documents).forEach((file) => data.append("documents", file));
    try {
      await api.post(`/schemes/${selected._id}/apply`, data);
      toast.success("Application submitted.");
      setSelected(null);
      setApplication({ note: "", documents: [] });
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <PageHeader title="Government Schemes" description="Browse active Panchayat schemes, upload documents, and track your application status." />
      {schemes.length === 0 ? <EmptyState title="No active schemes" /> : (
        <div className="grid gap-4 lg:grid-cols-2">
          {schemes.map((scheme) => (
            <article key={scheme._id} className="surface p-5">
              <div className="flex justify-between gap-3">
                <h2 className="text-xl font-black">{scheme.title}</h2>
                {scheme.deadline ? <span className="text-xs font-bold text-neutral-500">Deadline {new Date(scheme.deadline).toLocaleDateString()}</span> : null}
              </div>
              <p className="mt-3 text-sm leading-6 text-neutral-600">{scheme.description}</p>
              <div className="mt-4 rounded-lg bg-neutral-50 p-3 text-sm">
                <p className="font-bold">Eligibility</p>
                <p className="mt-1 text-neutral-600">{scheme.eligibility}</p>
              </div>
              <p className="mt-3 text-sm text-neutral-500">Documents: {(scheme.requiredDocs || []).join(", ") || "As applicable"}</p>
              <Button className="mt-4" icon={FileUp} disabled={appliedSchemeIds.has(scheme._id)} onClick={() => setSelected(scheme)}>
                {appliedSchemeIds.has(scheme._id) ? "Applied" : "Apply"}
              </Button>
            </article>
          ))}
        </div>
      )}

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-black">My applications</h2>
        {applications.length === 0 ? <EmptyState title="No applications yet" /> : (
          <div className="grid gap-3">
            {applications.map((item) => (
              <div key={item._id} className="surface flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-bold">{item.scheme?.title}</p>
                  <p className="text-sm text-neutral-500">{item.remarks || "Awaiting review"}</p>
                </div>
                <StatusBadge value={item.status} />
              </div>
            ))}
          </div>
        )}
      </section>

      <Modal open={Boolean(selected)} title={`Apply: ${selected?.title || ""}`} onClose={() => setSelected(null)} footer={<Button onClick={apply}>Submit application</Button>}>
        <div className="space-y-4">
          <Field label="Note"><Textarea value={application.note} onChange={(e) => setApplication({ ...application, note: e.target.value })} /></Field>
          <Field label="Documents"><Input type="file" multiple accept="image/*,application/pdf" onChange={(e) => setApplication({ ...application, documents: e.target.files })} /></Field>
        </div>
      </Modal>
    </>
  );
}
