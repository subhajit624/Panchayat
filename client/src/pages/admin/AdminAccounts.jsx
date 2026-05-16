import { KeyRound, ShieldPlus, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import { Field, Input, Select } from "../../components/FormField";
import { Loader, EmptyState } from "../../components/Loader";
import { PageHeader } from "../../components/PageHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { api, getErrorMessage } from "../../services/api";

const initialForm = {
  name: "",
  phoneNumber: "",
  password: "",
  gender: "prefer-not-to-say",
};

export default function AdminAccounts() {
  const [admins, setAdmins] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/users/admins");
    setAdmins(data.items);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/users/admins", form);
      toast.success("Admin account created.");
      setForm(initialForm);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes aa-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes aa-float {
          0%,100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.03);
          }
        }

        .aa-rise {
          animation: aa-rise .6s cubic-bezier(.22,1,.36,1) both;
        }

        .aa-card {
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 45px rgba(0,0,0,.22);
        }

        .aa-icon-float {
          animation: aa-float 3s ease-in-out infinite;
        }
      `}</style>

      <PageHeader
        eyebrow="Admin only"
        title="Admin Accounts"
        description="Create trusted Panchayat admin logins. New admins can immediately sign in with their phone number and password."
      />

      <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
        {/* Form */}
        <form
          onSubmit={submit}
          className="aa-card aa-rise h-max overflow-hidden rounded-3xl"
        >
          <div
            className="relative overflow-hidden border-b border-white/10 p-6"
            style={{
              background: "linear-gradient(135deg,#0d0d1e 0%,#0a0a16 100%)",
            }}
          >
            <div
              className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl"
              style={{
                background: "rgba(99,102,241,.12)",
              }}
            />

            <div className="relative z-10 flex items-center gap-4">
              <span
                className="aa-icon-float grid h-14 w-14 place-items-center rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(99,102,241,.25), rgba(79,70,229,.10))",
                  border: "1px solid rgba(99,102,241,.25)",
                }}
              >
                <ShieldPlus size={24} className="text-indigo-300" />
              </span>

              <div>
                <h2 className="text-2xl font-black text-white">
                  Add Admin
                </h2>
                <p className="mt-1 text-sm text-neutral-400">
                  Protected by role-based access
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <Field label="Admin name">
              <Input
                name="name"
                value={form.name}
                onChange={update}
                required
              />
            </Field>

            <Field label="Phone number">
              <Input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={update}
                inputMode="numeric"
                maxLength="10"
                required
              />
            </Field>

            <Field label="Temporary password">
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={update}
                minLength="6"
                required
              />
            </Field>

            <Field label="Gender">
              <Select
                name="gender"
                value={form.gender}
                onChange={update}
              >
                <option value="prefer-not-to-say">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            </Field>

            <Button
              type="submit"
              icon={ShieldPlus}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? "Creating admin..." : "Create admin"}
            </Button>
          </div>
        </form>

        {/* Directory */}
        <section
          className="aa-card aa-rise rounded-3xl p-6"
          style={{
            animationDelay: "120ms",
          }}
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-white">
                Admin Directory
              </h2>

              <p className="mt-2 text-sm text-neutral-400">
                Accounts with full Panchayat management access.
              </p>
            </div>

            <span className="rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm font-black text-indigo-300">
              {admins.length} admins
            </span>
          </div>

          {loading ? (
            <Loader />
          ) : admins.length === 0 ? (
            <EmptyState title="No admins found" />
          ) : (
            <div className="grid gap-4">
              {admins.map((admin) => (
                <article
                  key={admin._id}
                  className="
                    group
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/5
                    p-5
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:-translate-y-1.5
                    hover:border-indigo-400/20
                  "
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span
                        className="
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
                          transition-all
                          duration-300
                          group-hover:text-white
                        "
                      >
                        <UserCog size={22} />
                      </span>

                      <div>
                        <p className="font-black text-white">
                          {admin.name}
                        </p>

                        <p className="mt-1 text-sm text-neutral-400">
                          {admin.phoneNumber}
                        </p>
                      </div>
                    </div>

                    <StatusBadge
                      value={admin.isBlocked ? "blocked" : "approved"}
                    />
                  </div>

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      gap-2
                      rounded-2xl
                      border
                      border-white/8
                      bg-white/4
                      px-4
                      py-3
                      text-xs
                      font-semibold
                      text-neutral-300
                    "
                  >
                    <KeyRound size={14} />
                    Created{" "}
                    {new Date(admin.createdAt).toLocaleDateString()}
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