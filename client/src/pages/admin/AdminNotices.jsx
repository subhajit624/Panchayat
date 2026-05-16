import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import { Field, Input, Select, Textarea } from "../../components/FormField";
import { Loader, EmptyState } from "../../components/Loader";
import { PageHeader } from "../../components/PageHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { api, getErrorMessage } from "../../services/api";

const initial = { title: "", description: "", priority: "normal", attachment: null };

export default function AdminNotices() {
  const [form, setForm] = useState(initial);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/notices", { params: { limit: 50 } });
    setNotices(data.items);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({ ...current, [name]: files ? files[0] : value }));
  };

  const create = async (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });
    try {
      await api.post("/notices", data);
      toast.success("Notice published.");
      setForm(initial);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const remove = async (notice) => {
    try {
      await api.delete(`/notices/${notice._id}`);
      toast.success("Notice deleted.");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <PageHeader title="Notices" description="Publish Panchayat announcements with optional PDF or image attachments." />
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={create} className="surface h-max space-y-4 p-5">
          <h2 className="text-lg font-black">Create notice</h2>
          <Field label="Title"><Input name="title" value={form.title} onChange={update} required /></Field>
          <Field label="Description"><Textarea name="description" value={form.description} onChange={update} required /></Field>
          <Field label="Priority">
            <Select name="priority" value={form.priority} onChange={update}>
              <option value="normal">Normal</option>
              <option value="important">Important</option>
              <option value="urgent">Urgent</option>
            </Select>
          </Field>
          <Field label="Attachment"><Input name="attachment" type="file" accept="image/*,application/pdf" onChange={update} /></Field>
          <Button type="submit" icon={Plus}>Publish notice</Button>
        </form>
        <section>
          {loading ? <Loader /> : notices.length === 0 ? <EmptyState title="No notices" /> : (
            <div className="grid gap-3">
              {notices.map((notice) => (
                <article key={notice._id} className="surface p-4">
                  <div className="flex flex-wrap justify-between gap-3">
                    <div>
                      <p className="font-bold">{notice.title}</p>
                      <p className="mt-1 text-sm text-neutral-500">{notice.description}</p>
                    </div>
                    <StatusBadge value={notice.priority} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    {notice.attachment?.url ? <a className="text-sm font-bold underline" href={notice.attachment.url} target="_blank" rel="noreferrer">Attachment</a> : null}
                    <Button variant="secondary" icon={Trash2} onClick={() => remove(notice)}>Delete</Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
