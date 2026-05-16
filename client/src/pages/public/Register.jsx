import { UserPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Field, Input, Select } from "../../components/FormField";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../services/api";

const initial = {
  name: "",
  phoneNumber: "",
  wardNumber: "",
  password: "",
  gender: "prefer-not-to-say",
  profilePhoto: null,
};

export default function Register() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const { registerCitizen } = useAuth();
  const navigate = useNavigate();

  const update = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({ ...current, [name]: files ? files[0] : value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      await registerCitizen(data);
      toast.success("Citizen account created.");
      navigate("/citizen", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <form onSubmit={onSubmit} className="surface space-y-5 p-6 md:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Citizen registration</p>
          <h1 className="mt-2 text-3xl font-black">Create your Smart Panchayat account</h1>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full name">
            <Input name="name" value={form.name} onChange={update} required />
          </Field>
          <Field label="Phone number">
            <Input name="phoneNumber" value={form.phoneNumber} onChange={update} inputMode="numeric" maxLength="10" required />
          </Field>
          <Field label="Ward number">
            <Input name="wardNumber" value={form.wardNumber} onChange={update} type="number" min="1" required />
          </Field>
          <Field label="Gender">
            <Select name="gender" value={form.gender} onChange={update}>
              <option value="prefer-not-to-say">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Password">
            <Input name="password" type="password" value={form.password} onChange={update} minLength="6" required />
          </Field>
          <Field label="Profile photo">
            <Input name="profilePhoto" type="file" accept="image/*" onChange={update} />
          </Field>
        </div>
        <Button type="submit" icon={UserPlus} disabled={submitting} className="w-full md:w-auto">
          {submitting ? "Creating account" : "Register"}
        </Button>
        <p className="text-sm text-neutral-600">
          Want to offer services locally? <Link to="/worker-register" className="font-bold text-black hover:underline">Register as a worker.</Link>
        </p>
      </form>
    </main>
  );
}
