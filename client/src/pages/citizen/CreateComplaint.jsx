import { Sparkles, Send } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Field, Input, Select, Textarea } from "../../components/FormField";
import { PageHeader } from "../../components/PageHeader";
import { api, getErrorMessage } from "../../services/api";
import { complaintCategories, priorities, titleCase } from "../../utils/constants";

const initial = {
  title: "",
  description: "",
  category: "water",
  priority: "medium",
  image: null,
};

export default function CreateComplaint() {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const navigate = useNavigate();

  const update = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({ ...current, [name]: files ? files[0] : value }));
  };

  const predict = async () => {
    if (!form.title && !form.description) {
      toast.error("Add a title or description first.");
      return;
    }
    setPredicting(true);
    try {
      const { data } = await api.post("/ai/complaint-insights", {
        title: form.title,
        description: form.description,
      });
      setForm((current) => ({
        ...current,
        category: data.insight.category,
        priority: data.insight.priority,
      }));
      toast.success("AI suggestion applied.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setPredicting(false);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      await api.post("/complaints", data);
      toast.success("Complaint submitted.");
      navigate("/citizen/complaints");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Create Complaint"
        description="Submit a ward complaint with category, priority, description, and optional photo evidence."
        action={<Button variant="secondary" icon={Sparkles} onClick={predict} disabled={predicting}>{predicting ? "Checking" : "AI suggest"}</Button>}
      />
      <form onSubmit={onSubmit} className="surface max-w-3xl space-y-5 p-6">
        <Field label="Complaint title">
          <Input name="title" value={form.title} onChange={update} required />
        </Field>
        <Field label="Description">
          <Textarea name="description" value={form.description} onChange={update} required />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Category">
            <Select name="category" value={form.category} onChange={update}>
              {complaintCategories.map((category) => <option key={category} value={category}>{titleCase(category)}</option>)}
            </Select>
          </Field>
          <Field label="Priority">
            <Select name="priority" value={form.priority} onChange={update}>
              {priorities.map((priority) => <option key={priority} value={priority}>{titleCase(priority)}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Image evidence">
          <Input name="image" type="file" accept="image/*" onChange={update} />
        </Field>
        <Button type="submit" icon={Send} disabled={submitting}>
          {submitting ? "Submitting" : "Submit complaint"}
        </Button>
      </form>
    </>
  );
}
