import { Send } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import { Field, Input, Select, Textarea } from "../../components/FormField";
import { Loader, EmptyState } from "../../components/Loader";
import { PageHeader } from "../../components/PageHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { api, getErrorMessage } from "../../services/api";
import { certificateTypes, titleCase } from "../../utils/constants";

export default function Certificates() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ type: "income", purpose: "", documents: [] });

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/certificates/mine");
    setItems(data.items);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("type", form.type);
    data.append("purpose", form.purpose);
    Array.from(form.documents).forEach((file) => data.append("documents", file));

    try {
      await api.post("/certificates", data);
      toast.success("Certificate request submitted.");
      setForm({ type: "income", purpose: "", documents: [] });
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <PageHeader title="Certificate Requests" description="Apply for income, residence, caste, birth forwarding, or death forwarding certificates." />
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <form onSubmit={submit} className="surface h-max space-y-4 p-5">
          <Field label="Certificate type">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {certificateTypes.map((type) => <option key={type} value={type}>{titleCase(type)}</option>)}
            </Select>
          </Field>
          <Field label="Purpose"><Textarea value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} /></Field>
          <Field label="Documents"><Input type="file" multiple accept="image/*,application/pdf" onChange={(e) => setForm({ ...form, documents: e.target.files })} /></Field>
          <Button type="submit" icon={Send}>Submit request</Button>
        </form>
        <section>
          {loading ? <Loader /> : items.length === 0 ? <EmptyState title="No certificate requests" /> : (
            <div className="grid gap-3">
              {items.map((item) => (
                <div key={item._id} className="surface flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-bold">{titleCase(item.type)}</p>
                    <p className="text-sm text-neutral-500">{item.remarks || item.purpose || "Awaiting review"}</p>
                  </div>
                  <StatusBadge value={item.status} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
