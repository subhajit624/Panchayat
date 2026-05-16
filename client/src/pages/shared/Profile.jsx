import { Save } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import { Field, Input, Select, Textarea } from "../../components/FormField";
import { PageHeader } from "../../components/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { api, getErrorMessage } from "../../services/api";
import { workerCategories } from "../../utils/constants";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name || "",
    wardNumber: user.wardNumber || "",
    gender: user.gender || "prefer-not-to-say",
    category: user.workerDetails?.category || "plumber",
    skills: user.workerDetails?.skills?.join(", ") || "",
    experienceYears: user.workerDetails?.experienceYears || 0,
    availability: user.workerDetails?.availability || "available",
    profilePhoto: null,
  });

  const update = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({ ...current, [name]: files ? files[0] : value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) data.append(key, value);
    });

    try {
      const response = await api.patch("/users/me", data);
      setUser(response.data.user);
      toast.success("Profile updated.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <PageHeader title="Profile" description="Keep your Panchayat account details accurate for routing services and updates." />
      <form onSubmit={submit} className="surface max-w-3xl space-y-5 p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Name"><Input name="name" value={form.name} onChange={update} /></Field>
          <Field label="Ward number"><Input name="wardNumber" type="number" min="1" value={form.wardNumber} onChange={update} /></Field>
          <Field label="Gender">
            <Select name="gender" value={form.gender} onChange={update}>
              <option value="prefer-not-to-say">Prefer not to say</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </Field>
          <Field label="Profile photo"><Input name="profilePhoto" type="file" accept="image/*" onChange={update} /></Field>
        </div>
        {user.role === "worker" ? (
          <div className="grid gap-5 border-t border-neutral-200 pt-5 md:grid-cols-2">
            <Field label="Category">
              <Select name="category" value={form.category} onChange={update}>
                {workerCategories.map((category) => <option key={category} value={category}>{category}</option>)}
              </Select>
            </Field>
            <Field label="Availability">
              <Select name="availability" value={form.availability} onChange={update}>
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </Select>
            </Field>
            <Field label="Experience years"><Input name="experienceYears" type="number" min="0" value={form.experienceYears} onChange={update} /></Field>
            <div className="md:col-span-2">
              <Field label="Skills"><Textarea name="skills" value={form.skills} onChange={update} /></Field>
            </div>
          </div>
        ) : null}
        <Button type="submit" icon={Save}>Save profile</Button>
      </form>
    </>
  );
}
