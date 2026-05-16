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
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
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
      <PageHeader
        eyebrow="Admin only"
        title="Admin Accounts"
        description="Create trusted Panchayat admin logins. New admins can immediately sign in with their phone number and password."
      />

      <div className="grid gap-6 xl:grid-cols-[430px_1fr]">
        <form onSubmit={submit} className="surface animate-rise h-max overflow-hidden p-0">
          <div className="border-b border-neutral-200 bg-black p-5 text-white">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg border border-white/20 bg-white text-black">
                <ShieldPlus size={20} />
              </span>
              <div>
                <h2 className="text-xl font-black">Add Admin</h2>
                <p className="text-sm text-neutral-300">Protected by role-based access</p>
              </div>
            </div>
          </div>
          <div className="space-y-4 p-5">
            <Field label="Admin name">
              <Input name="name" value={form.name} onChange={update} required />
            </Field>
            <Field label="Phone number">
              <Input name="phoneNumber" value={form.phoneNumber} onChange={update} inputMode="numeric" maxLength="10" required />
            </Field>
            <Field label="Temporary password">
              <Input name="password" type="password" value={form.password} onChange={update} minLength="6" required />
            </Field>
            <Field label="Gender">
              <Select name="gender" value={form.gender} onChange={update}>
                <option value="prefer-not-to-say">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            </Field>
            <Button type="submit" icon={ShieldPlus} disabled={submitting} className="w-full">
              {submitting ? "Creating admin" : "Create admin"}
            </Button>
          </div>
        </form>

        <section className="surface animate-rise p-5 [animation-delay:120ms]">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">Admin Directory</h2>
              <p className="mt-1 text-sm text-neutral-500">Accounts with full Panchayat management access.</p>
            </div>
            <span className="rounded-full border border-neutral-300 px-3 py-1 text-sm font-black">{admins.length} admins</span>
          </div>

          {loading ? (
            <Loader />
          ) : admins.length === 0 ? (
            <EmptyState title="No admins found" />
          ) : (
            <div className="grid gap-3">
              {admins.map((admin) => (
                <article key={admin._id} className="group rounded-lg border border-neutral-200 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-black hover:shadow-[0_18px_45px_rgba(0,0,0,0.10)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-lg bg-neutral-100 text-black transition group-hover:bg-black group-hover:text-white">
                        <UserCog size={20} />
                      </span>
                      <div>
                        <p className="font-black">{admin.name}</p>
                        <p className="text-sm text-neutral-500">{admin.phoneNumber}</p>
                      </div>
                    </div>
                    <StatusBadge value={admin.isBlocked ? "blocked" : "approved"} />
                  </div>
                  <div className="mt-3 flex items-center gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-xs font-semibold text-neutral-600">
                    <KeyRound size={14} />
                    Created {new Date(admin.createdAt).toLocaleDateString()}
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
