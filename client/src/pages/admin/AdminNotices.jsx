import {
  Plus,
  Trash2,
  Megaphone,
  Paperclip,
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
  priority: "normal",
  attachment: null,
};

export default function AdminNotices() {
  const [form, setForm] = useState(initial);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/notices", {
      params: { limit: 50 },
    });
    setNotices(data.items);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = (event) => {
    const { name, value, files } = event.target;

    setForm((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }));
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
      <style>{`
        @keyframes an-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes an-float {
          0%,100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .an-rise {
          animation: an-rise .6s cubic-bezier(.22,1,.36,1) both;
        }

        .an-card {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 45px rgba(0,0,0,.22);
        }

        .an-float {
          animation: an-float 3s ease-in-out infinite;
        }
      `}</style>

      <PageHeader
        title="Notices"
        description="Publish Panchayat announcements with optional PDF or image attachments."
      />

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        {/* Create Form */}
        <form
          onSubmit={create}
          className="
            an-card
            an-rise
            h-max
            rounded-3xl
            p-6
            space-y-5
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                an-float
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
              <Megaphone size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">
                Create Notice
              </h2>

              <p className="mt-1 text-sm text-neutral-400">
                Publish official Panchayat announcements
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

          <Field label="Priority">
            <Select
              name="priority"
              value={form.priority}
              onChange={update}
            >
              <option value="normal">Normal</option>
              <option value="important">Important</option>
              <option value="urgent">Urgent</option>
            </Select>
          </Field>

          <Field label="Attachment">
            <Input
              name="attachment"
              type="file"
              accept="image/*,application/pdf"
              onChange={update}
            />
          </Field>

          <Button type="submit" icon={Plus}>
            Publish notice
          </Button>
        </form>

        {/* Notice List */}
        <section>
          {loading ? (
            <Loader />
          ) : notices.length === 0 ? (
            <EmptyState title="No notices" />
          ) : (
            <div className="grid gap-4">
              {notices.map((notice) => (
                <article
                  key={notice._id}
                  className="
                    an-card
                    an-rise
                    group
                    rounded-3xl
                    p-5
                    transition-all
                    duration-300
                    hover:-translate-y-1.5
                    hover:border-indigo-400/20
                  "
                >
                  <div className="flex flex-wrap justify-between gap-4">
                    <div>
                      <p className="text-xl font-black text-white">
                        {notice.title}
                      </p>

                      <p className="mt-3 text-sm leading-7 text-neutral-300">
                        {notice.description}
                      </p>
                    </div>

                    <StatusBadge value={notice.priority} />
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    {notice.attachment?.url ? (
                      <a
                        href={notice.attachment.url}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          inline-flex
                          items-center
                          gap-2
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
                        <Paperclip size={15} />
                        Attachment
                      </a>
                    ) : null}

                    <Button
                      variant="danger"
                      icon={Trash2}
                      onClick={() => remove(notice)}
                    >
                      Delete
                    </Button>
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