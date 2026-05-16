import { Hammer } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Field, Input, Select, Textarea } from "../../components/FormField";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../services/api";
import { workerCategories } from "../../utils/constants";

const initial = {
  name: "",
  phoneNumber: "",
  wardNumber: "",
  password: "",
  gender: "prefer-not-to-say",
  category: "plumber",
  skills: "",
  experienceYears: "",
  availability: "available",
  profilePhoto: null,
};

export default function WorkerRegister() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const { registerWorker } = useAuth();
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
      await registerWorker(data);
      toast.success("Worker application submitted.");
      navigate("/worker/pending", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <form onSubmit={onSubmit} className="surface space-y-5 p-6 md:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">Worker verification</p>
          <h1 className="mt-2 text-3xl font-black">Apply as a verified local worker</h1>
          <p className="mt-2 text-sm text-neutral-600">Your application remains pending until a Panchayat admin approves it.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full name"><Input name="name" value={form.name} onChange={update} required /></Field>
          <Field label="Phone number"><Input name="phoneNumber" value={form.phoneNumber} onChange={update} inputMode="numeric" maxLength="10" required /></Field>
          <Field label="Ward number"><Input name="wardNumber" value={form.wardNumber} onChange={update} type="number" min="1" required /></Field>
          <Field label="Password"><Input name="password" type="password" value={form.password} onChange={update} minLength="6" required /></Field>
          <Field label="Category">
            <Select name="category" value={form.category} onChange={update}>
              {workerCategories.map((category) => <option key={category} value={category}>{category}</option>)}
            </Select>
          </Field>
          <Field label="Experience years"><Input name="experienceYears" type="number" min="0" value={form.experienceYears} onChange={update} /></Field>
          <Field label="Gender">
            <Select name="gender" value={form.gender} onChange={update}>
              <option value="prefer-not-to-say">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Profile photo"><Input name="profilePhoto" type="file" accept="image/*" onChange={update} /></Field>
          <div className="md:col-span-2">
            <Field label="Skills" hint="Comma separated, for example: pump repair, wiring, pipe fitting">
              <Textarea name="skills" value={form.skills} onChange={update} />
            </Field>
          </div>
        </div>
        <Button type="submit" icon={Hammer} disabled={submitting}>
          {submitting ? "Submitting application" : "Submit worker application"}
        </Button>
      </form>
    </main>
  );
}
