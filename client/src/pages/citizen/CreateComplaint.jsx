import {
  Sparkles,
  Send,
  Upload,
  AlertTriangle,
  FileImage,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import {
  Field,
  Input,
  Select,
  Textarea,
} from "../../components/FormField";
import { PageHeader } from "../../components/PageHeader";
import { api, getErrorMessage } from "../../services/api";
import {
  complaintCategories,
  priorities,
  titleCase,
} from "../../utils/constants";

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

    setForm((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }));
  };

  const predict = async () => {
    if (!form.title && !form.description) {
      toast.error("Add a title or description first.");
      return;
    }

    setPredicting(true);

    try {
      const { data } = await api.post(
        "/ai/complaint-insights",
        {
          title: form.title,
          description: form.description,
        }
      );

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
      <style>{`
        @keyframes cc-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes cc-float {
          0%,100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .cc-card {
          animation: cc-rise .6s cubic-bezier(.22,1,.36,1) both;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 45px rgba(0,0,0,.22);
        }

        .cc-float {
          animation: cc-float 3s ease-in-out infinite;
        }
      `}</style>

      <PageHeader
        title="Create Complaint"
        description="Submit a ward complaint with category, priority, description, and optional photo evidence."
        action={
          <Button
            variant="secondary"
            icon={Sparkles}
            onClick={predict}
            disabled={predicting}
            className="
              border-indigo-400/20
              bg-indigo-500/10
              text-indigo-300
              hover:bg-indigo-500/20
              hover:text-white
            "
          >
            {predicting ? "Checking" : "AI suggest"}
          </Button>
        }
      />

      <form
        onSubmit={onSubmit}
        className="
          cc-card
          max-w-4xl
          rounded-3xl
          p-8
          space-y-8
        "
      >
        {/* header */}
        <div className="flex flex-wrap items-center gap-5">
          <div
            className="
              cc-float
              grid
              h-20
              w-20
              place-items-center
              rounded-3xl
              border
              border-amber-400/20
              bg-gradient-to-br
              from-amber-500/20
              to-orange-500/10
              text-amber-300
            "
          >
            <AlertTriangle size={34} />
          </div>

          <div>
            <h2 className="text-3xl font-black text-white">
              Report New Issue
            </h2>

            <p className="mt-2 text-sm text-neutral-400">
              Help your Panchayat resolve problems faster
            </p>
          </div>
        </div>

        {/* title */}
        <Field label="Complaint title">
          <Input
            name="title"
            value={form.title}
            onChange={update}
            required
          />
        </Field>

        {/* description */}
        <Field label="Description">
          <Textarea
            name="description"
            value={form.description}
            onChange={update}
            required
          />
        </Field>

        {/* selects */}
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Category">
            <Select
              name="category"
              value={form.category}
              onChange={update}
            >
              {complaintCategories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {titleCase(category)}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Priority">
            <Select
              name="priority"
              value={form.priority}
              onChange={update}
            >
              {priorities.map((priority) => (
                <option
                  key={priority}
                  value={priority}
                >
                  {titleCase(priority)}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        {/* upload */}
        <Field label="Image evidence">
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
              px-6
              py-6
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
            Upload complaint image

            <Input
              className="hidden"
              name="image"
              type="file"
              accept="image/*"
              onChange={update}
            />
          </label>

          {form.image ? (
            <div
              className="
                mt-4
                flex
                items-center
                gap-3
                rounded-2xl
                border
                border-emerald-400/15
                bg-emerald-500/10
                px-4
                py-3
                text-sm
                font-semibold
                text-emerald-300
              "
            >
              <FileImage size={18} />
              {form.image.name}
            </div>
          ) : null}
        </Field>

        {/* button */}
        <Button
          type="submit"
          icon={Send}
          disabled={submitting}
          className="px-8"
        >
          {submitting
            ? "Submitting"
            : "Submit complaint"}
        </Button>
      </form>
    </>
  );
}