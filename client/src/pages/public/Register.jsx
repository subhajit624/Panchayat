import { UserPlus, User, Phone, MapPin, Lock, ImagePlus, ChevronRight } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Field, Input, Select } from "../../components/FormField";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../services/api";

const initial = {
  name:         "",
  phoneNumber:  "",
  wardNumber:   "",
  password:     "",
  gender:       "prefer-not-to-say",
  profilePhoto: null,
};

/* field groups for visual separation */
const SECTIONS = [
  {
    title: "Personal details",
    color: "#6366f1",
    fields: ["name", "phoneNumber"],
  },
  {
    title: "Location & identity",
    color: "#10b981",
    fields: ["wardNumber", "gender"],
  },
  {
    title: "Security & photo",
    color: "#a78bfa",
    fields: ["password", "profilePhoto"],
  },
];

export default function Register() {
  const [form,       setForm]       = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [photoName,  setPhotoName]  = useState("");
  const { registerCitizen } = useAuth();
  const navigate = useNavigate();

  const update = (event) => {
    const { name, value, files } = event.target;
    if (files) setPhotoName(files[0]?.name ?? "");
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
    <>
      <style>{`
        /* ── entrance ── */
        @keyframes rg-rise {
          from { opacity:0; transform:translateY(22px) scale(.98); }
          to   { opacity:1; transform:translateY(0)    scale(1);   }
        }
        .rg-card  { animation: rg-rise .60s cubic-bezier(.22,1,.36,1) both; }
        .rg-head  { animation: rg-rise .60s cubic-bezier(.22,1,.36,1) .06s both; }
        .rg-body  { animation: rg-rise .60s cubic-bezier(.22,1,.36,1) .14s both; }

        /* ── shimmer text ── */
        @keyframes rg-shimmer {
          0%  { background-position:0%   center; }
          100%{ background-position:200% center; }
        }
        .rg-gradient-text {
          background:linear-gradient(120deg,#fff 0%,#a5b4fc 50%,#34d399 100%);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:rg-shimmer 5s linear infinite;
        }

        /* ── blob ── */
        @keyframes rg-float { 0%,100%{transform:translateY(0) scale(1);} 50%{transform:translateY(-14px) scale(1.03);} }
        .rg-blob {
          position:absolute; border-radius:50%; pointer-events:none;
          filter:blur(60px); animation:rg-float 10s ease-in-out infinite;
        }

        /* ── section divider ── */
        .rg-section-title {
          font-size:.68rem; font-weight:700; letter-spacing:.14em;
          text-transform:uppercase; display:flex; align-items:center; gap:.55rem;
          margin-bottom:.9rem;
        }
        .rg-section-dot {
          width:8px; height:8px; border-radius:50%; flex-shrink:0;
        }
        .rg-section-line {
          flex:1; height:1px; background:rgba(255,255,255,.07);
        }

        /* ── file upload zone ── */
        .rg-file-zone {
          position:relative; display:flex; align-items:center; gap:.75rem;
          border:1px dashed rgba(255,255,255,.15);
          border-radius:10px; padding:.75rem 1rem;
          background:rgba(255,255,255,.025);
          cursor:pointer;
          transition:border-color .2s ease, background .2s ease;
        }
        .rg-file-zone:hover {
          border-color:rgba(99,102,241,.45);
          background:rgba(99,102,241,.06);
        }
        .rg-file-zone input[type="file"] {
          position:absolute; inset:0; opacity:0; cursor:pointer; width:100%; height:100%;
        }
        .rg-file-icon {
          display:grid; place-items:center;
          width:36px; height:36px; border-radius:9px; flex-shrink:0;
          background:rgba(99,102,241,.12); border:1px solid rgba(99,102,241,.22);
        }

        /* ── submit button ── */
        .rg-submit {
          background:linear-gradient(135deg,#6366f1,#4f46e5) !important;
          border:none !important; color:#fff !important;
          box-shadow:0 4px 20px rgba(99,102,241,.40);
          transition:transform .2s ease, box-shadow .2s ease, filter .2s ease !important;
        }
        .rg-submit:hover:not(:disabled) {
          transform:translateY(-2px) !important;
          box-shadow:0 8px 28px rgba(99,102,241,.55) !important;
          filter:brightness(1.08);
        }
        .rg-submit:disabled { opacity:.55; }

        /* ── worker link ── */
        .rg-worker-link {
          display:inline-flex; align-items:center; gap:.3rem;
          color:#a5b4fc; font-weight:700; text-decoration:none;
          transition:color .2s ease;
        }
        .rg-worker-link:hover { color:#fff; }
      `}</style>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">

        {/* ── top banner ── */}
        <div className="rg-head relative mb-6 overflow-hidden rounded-2xl px-8 py-8 text-white"
          style={{ background:"linear-gradient(135deg,#0d0d1e 0%,#0a0a16 100%)", border:"1px solid rgba(255,255,255,.07)" }}>
          <div className="rg-blob" style={{ top:"-40px", right:"-20px", width:"260px", height:"260px", background:"rgba(99,102,241,.12)", animationDelay:"0s"  }} />
          <div className="rg-blob" style={{ bottom:"-30px",left:"-10px", width:"200px", height:"200px", background:"rgba(52,211,153,.07)",  animationDelay:"5s"  }} />
          <div className="animated-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative z-10 flex items-center gap-4">
            <div style={{ display:"grid", placeItems:"center", width:"48px", height:"48px", borderRadius:"13px", background:"linear-gradient(135deg,rgba(99,102,241,.22),rgba(79,70,229,.08))", border:"1px solid rgba(99,102,241,.28)", boxShadow:"0 0 18px rgba(99,102,241,.16)", flexShrink:0 }}>
              <UserPlus size={22} className="text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Citizen registration</p>
              <h1 className="mt-0.5 text-2xl font-black leading-tight sm:text-3xl">
                Create your{" "}
                <span className="rg-gradient-text">Smart Panchayat</span>
                <br className="hidden sm:block" /> account
              </h1>
            </div>
          </div>
        </div>

        {/* ── form card ── */}
        <form onSubmit={onSubmit}
          className="rg-card surface space-y-7 p-6 md:p-8"
          style={{ borderRadius:"16px" }}
        >
          {/* ── personal details ── */}
          <div className="rg-body">
            <p className="rg-section-title" style={{ color:"#6366f1" }}>
              <span className="rg-section-dot" style={{ background:"#6366f1" }} />
              Personal details
              <span className="rg-section-line" />
            </p>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full name">
                <Input name="name" value={form.name} onChange={update} placeholder="Your full name" required />
              </Field>
              <Field label="Phone number">
                <Input name="phoneNumber" value={form.phoneNumber} onChange={update} inputMode="numeric" maxLength="10" placeholder="10-digit mobile number" required />
              </Field>
            </div>
          </div>

          {/* divider */}
          <div style={{ height:"1px", background:"rgba(255,255,255,.06)" }} />

          {/* ── location & identity ── */}
          <div>
            <p className="rg-section-title" style={{ color:"#10b981" }}>
              <span className="rg-section-dot" style={{ background:"#10b981" }} />
              Location &amp; identity
              <span className="rg-section-line" />
            </p>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Ward number">
                <Input name="wardNumber" value={form.wardNumber} onChange={update} type="number" min="1" placeholder="e.g. 7" required />
              </Field>
              <Field label="Gender">
                <Select name="gender" value={form.gender} onChange={update}>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </Field>
            </div>
          </div>

          {/* divider */}
          <div style={{ height:"1px", background:"rgba(255,255,255,.06)" }} />

          {/* ── security & photo ── */}
          <div>
            <p className="rg-section-title" style={{ color:"#a78bfa" }}>
              <span className="rg-section-dot" style={{ background:"#a78bfa" }} />
              Security &amp; photo
              <span className="rg-section-line" />
            </p>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Password">
                <Input name="password" type="password" value={form.password} onChange={update} minLength="6" placeholder="Min. 6 characters" required />
              </Field>

              {/* custom file zone */}
              <Field label="Profile photo">
                <div className="rg-file-zone">
                  <input name="profilePhoto" type="file" accept="image/*" onChange={update} />
                  <div className="rg-file-icon">
                    <ImagePlus size={17} className="text-indigo-400" />
                  </div>
                  <span className="truncate text-sm" style={{ color: photoName ? "#e8e8f0" : "#606078" }}>
                    {photoName || "Choose a photo…"}
                  </span>
                </div>
              </Field>
            </div>
          </div>

          {/* ── actions ── */}
          <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <Button type="submit" icon={UserPlus} disabled={submitting} className="rg-submit w-full sm:w-auto">
              {submitting ? "Creating account…" : "Register"}
            </Button>
            <p className="text-sm text-neutral-500">
              Offering local services?{" "}
              <Link to="/worker-register" className="rg-worker-link">
                Register as a worker <ChevronRight size={13} />
              </Link>
            </p>
          </div>
        </form>
      </main>
    </>
  );
}