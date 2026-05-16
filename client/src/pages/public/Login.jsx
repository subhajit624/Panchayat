import { LogIn } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Field, Input, Select } from "../../components/FormField";
import { dashboardPathFor, useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../services/api";

export default function Login() {
  const [form, setForm] = useState({ phoneNumber: "", password: "", role: "citizen" });
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(form);
      toast.success("Welcome back.");
      navigate(location.state?.from?.pathname || dashboardPathFor(user), { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl place-items-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-neutral-200 bg-white md:grid-cols-[1fr_420px]">
        <section className="hidden bg-black p-10 text-white md:block">
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Secure access</p>
          <h1 className="mt-6 text-4xl font-black">One login for every Panchayat service.</h1>
          <p className="mt-4 leading-7 text-neutral-300">
            Citizens, workers, and admins use the same authentication system with role based routing and protected dashboards.
          </p>
        </section>
        <form onSubmit={onSubmit} className="space-y-5 p-6 md:p-8">
          <div>
            <h2 className="text-2xl font-black">Login</h2>
            <p className="mt-2 text-sm text-neutral-500">Use your registered phone number and password.</p>
          </div>
          <Field label="Role">
            <Select name="role" value={form.role} onChange={update}>
              <option value="citizen">Citizen</option>
              <option value="worker">Worker</option>
              <option value="admin">Admin</option>
            </Select>
          </Field>
          <Field label="Phone number">
            <Input name="phoneNumber" value={form.phoneNumber} onChange={update} inputMode="numeric" maxLength="10" required />
          </Field>
          <Field label="Password">
            <Input name="password" type="password" value={form.password} onChange={update} required />
          </Field>
          {form.role === "admin" ? (
            <div className="rounded-lg border border-black bg-neutral-50 p-3 text-sm">
              <p className="font-black text-black">Default admin login</p>
              <p className="mt-1 text-neutral-600">Phone: <span className="font-bold text-black">9999999999</span></p>
              <p className="text-neutral-600">Password: <span className="font-bold text-black">Admin@12345</span></p>
            </div>
          ) : null}
          <Button type="submit" icon={LogIn} disabled={submitting} className="w-full">
            {submitting ? "Signing in" : "Login"}
          </Button>
          <div className="grid gap-2 text-sm text-neutral-600">
            <Link className="font-bold text-black hover:underline" to="/register">Create citizen account</Link>
            <Link className="font-bold text-black hover:underline" to="/worker-register">Apply as verified worker</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
