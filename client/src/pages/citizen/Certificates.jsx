import {
  Send,
  FileText,
  Upload,
  ShieldCheck,
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
import {
  certificateTypes,
  titleCase,
} from "../../utils/constants";

export default function Certificates() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    type: "income",
    purpose: "",
    documents: [],
  });

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

    Array.from(form.documents).forEach((file) =>
      data.append("documents", file)
    );

    try {
      await api.post("/certificates", data);

      toast.success("Certificate request submitted.");

      setForm({
        type: "income",
        purpose: "",
        documents: [],
      });

      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <style>{`
        @keyframes cert-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes cert-float {
          0%,100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .cert-card {
          animation: cert-rise .6s cubic-bezier(.22,1,.36,1) both;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 45px rgba(0,0,0,.22);
        }

        .cert-float {
          animation: cert-float 3s ease-in-out infinite;
        }
      `}</style>

      <PageHeader
        title="Certificate Requests"
        description="Apply for income, residence, caste, birth forwarding, or death forwarding certificates."
      />

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        {/* LEFT FORM */}
        <form
          onSubmit={submit}
          className="
            cert-card
            h-max
            rounded-3xl
            p-6
            space-y-6
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
                cert-float
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
              <ShieldCheck size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">
                Apply Certificate
              </h2>

              <p className="mt-1 text-sm text-neutral-400">
                Submit your request securely
              </p>
            </div>
          </div>

          <Field label="Certificate type">
            <Select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value,
                })
              }
            >
              {certificateTypes.map((type) => (
                <option key={type} value={type}>
                  {titleCase(type)}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Purpose">
            <Textarea
              value={form.purpose}
              onChange={(e) =>
                setForm({
                  ...form,
                  purpose: e.target.value,
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
                px-5
                py-5
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
                  setForm({
                    ...form,
                    documents: e.target.files,
                  })
                }
              />
            </label>
          </Field>

          <Button type="submit" icon={Send}>
            Submit request
          </Button>
        </form>

        {/* RIGHT LIST */}
        <section>
          {loading ? (
            <Loader />
          ) : items.length === 0 ? (
            <EmptyState title="No certificate requests" />
          ) : (
            <div className="grid gap-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="
                    cert-card
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-4
                    rounded-3xl
                    p-5
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-indigo-400/20
                  "
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="
                        grid
                        h-14
                        w-14
                        place-items-center
                        rounded-2xl
                        border
                        border-emerald-400/20
                        bg-gradient-to-br
                        from-emerald-500/20
                        to-teal-500/10
                        text-emerald-300
                      "
                    >
                      <FileText size={22} />
                    </div>

                    <div>
                      <p className="text-lg font-black text-white">
                        {titleCase(item.type)}
                      </p>

                      <p className="mt-2 text-sm leading-7 text-neutral-300">
                        {item.remarks ||
                          item.purpose ||
                          "Awaiting review"}
                      </p>
                    </div>
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