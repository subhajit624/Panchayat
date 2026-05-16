import {
  Hammer,
  User,
  Phone,
  MapPin,
  Lock,
  ImagePlus,
  Briefcase,
  Wrench,
} from "lucide-react";
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
  const [photoName, setPhotoName] = useState("");
  const { registerWorker } = useAuth();
  const navigate = useNavigate();

  const update = (event) => {
    const { name, value, files } = event.target;

    if (files) {
      setPhotoName(files[0]?.name ?? "");
    }

    setForm((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }));
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
    <>
      <style>{`
        @keyframes wr-rise {
          from {
            opacity: 0;
            transform: translateY(22px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes wr-shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        @keyframes wr-float {
          0%,100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-14px) scale(1.04);
          }
        }

        .wr-card {
          animation: wr-rise .65s cubic-bezier(.22,1,.36,1) both;
        }

        .wr-gradient-text {
          background: linear-gradient(120deg,#fff 0%,#a5b4fc 50%,#34d399 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: wr-shimmer 5s linear infinite;
        }

        .wr-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(60px);
          animation: wr-float 10s ease-in-out infinite;
        }

        .wr-section-title {
          font-size: .7rem;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: .6rem;
          margin-bottom: 1rem;
        }

        .wr-section-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .wr-section-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,.07);
        }

        .wr-file-zone {
          position: relative;
          display: flex;
          align-items: center;
          gap: .8rem;
          border: 1px dashed rgba(255,255,255,.14);
          border-radius: 12px;
          padding: .8rem 1rem;
          background: rgba(255,255,255,.025);
          cursor: pointer;
          transition: all .25s ease;
        }

        .wr-file-zone:hover {
          border-color: rgba(99,102,241,.45);
          background: rgba(99,102,241,.06);
        }

        .wr-file-zone input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
          width: 100%;
          height: 100%;
        }

        .wr-file-icon {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(99,102,241,.12);
          border: 1px solid rgba(99,102,241,.22);
          flex-shrink: 0;
        }

        .wr-submit {
          background: linear-gradient(135deg,#6366f1,#4f46e5) !important;
          border: none !important;
          color: white !important;
          box-shadow: 0 4px 20px rgba(99,102,241,.4);
          transition: all .25s ease !important;
        }

        .wr-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 28px rgba(99,102,241,.55);
        }

        .wr-submit:disabled {
          opacity: .55;
        }
      `}</style>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {/* Hero */}
        <div
          className="wr-card relative mb-7 overflow-hidden rounded-3xl px-8 py-9 text-white"
          style={{
            background: "linear-gradient(135deg,#0d0d1e 0%,#0a0a16 100%)",
            border: "1px solid rgba(255,255,255,.07)",
          }}
        >
          <div
            className="wr-blob"
            style={{
              top: "-40px",
              right: "-20px",
              width: "260px",
              height: "260px",
              background: "rgba(99,102,241,.12)",
            }}
          />

          <div
            className="wr-blob"
            style={{
              bottom: "-30px",
              left: "-20px",
              width: "220px",
              height: "220px",
              background: "rgba(52,211,153,.08)",
              animationDelay: "5s",
            }}
          />

          <div className="relative z-10 flex items-center gap-5">
            <div
              style={{
                display: "grid",
                placeItems: "center",
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background:
                  "linear-gradient(135deg,rgba(99,102,241,.22),rgba(79,70,229,.08))",
                border: "1px solid rgba(99,102,241,.28)",
              }}
            >
              <Hammer size={26} className="text-indigo-400" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                Worker verification
              </p>

              <h1 className="mt-1 text-3xl font-black leading-tight sm:text-4xl">
                Become a{" "}
                <span className="wr-gradient-text">verified local worker</span>
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-neutral-400">
                Your application remains pending until Panchayat admin approval.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="wr-card surface space-y-7 p-6 md:p-8"
          style={{ borderRadius: "18px" }}
        >
          {/* Personal */}
          <div>
            <p className="wr-section-title" style={{ color: "#6366f1" }}>
              <span
                className="wr-section-dot"
                style={{ background: "#6366f1" }}
              />
              Personal details
              <span className="wr-section-line" />
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full name">
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

              <Field label="Ward number">
                <Input
                  name="wardNumber"
                  value={form.wardNumber}
                  onChange={update}
                  type="number"
                  min="1"
                  required
                />
              </Field>

              <Field label="Password">
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
                <Select name="gender" value={form.gender} onChange={update}>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </Field>

              <Field label="Category">
                <Select name="category" value={form.category} onChange={update}>
                  {workerCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </div>

          <div style={{ height: "1px", background: "rgba(255,255,255,.06)" }} />

          {/* Professional */}
          <div>
            <p className="wr-section-title" style={{ color: "#10b981" }}>
              <span
                className="wr-section-dot"
                style={{ background: "#10b981" }}
              />
              Professional details
              <span className="wr-section-line" />
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Experience years">
                <Input
                  name="experienceYears"
                  type="number"
                  min="0"
                  value={form.experienceYears}
                  onChange={update}
                />
              </Field>

              <Field label="Profile photo">
                <div className="wr-file-zone">
                  <input
                    name="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={update}
                  />

                  <div className="wr-file-icon">
                    <ImagePlus size={18} className="text-indigo-400" />
                  </div>

                  <span
                    className="truncate text-sm"
                    style={{
                      color: photoName ? "#e8e8f0" : "#606078",
                    }}
                  >
                    {photoName || "Choose profile photo..."}
                  </span>
                </div>
              </Field>

              <div className="md:col-span-2">
                <Field
                  label="Skills"
                  hint="Comma separated, for example: pump repair, wiring, pipe fitting"
                >
                  <Textarea
                    name="skills"
                    value={form.skills}
                    onChange={update}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            icon={Hammer}
            disabled={submitting}
            className="wr-submit"
          >
            {submitting
              ? "Submitting application..."
              : "Submit worker application"}
          </Button>
        </form>
      </main>
    </>
  );
}