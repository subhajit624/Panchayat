import { LogIn, ShieldCheck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { Field, Input, Select } from "../../components/FormField";
import { dashboardPathFor, useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../services/api";

export default function Login() {
  const [form, setForm]           = useState({ phoneNumber: "", password: "", role: "citizen" });
  const [submitting, setSubmitting] = useState(false);
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();

  const update = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

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

  const roleColors = {
    citizen: { accent: "#6366f1", dim: "rgba(99,102,241,.12)", label: "Citizen portal"  },
    worker:  { accent: "#10b981", dim: "rgba(16,185,129,.12)", label: "Worker portal"   },
    admin:   { accent: "#f59e0b", dim: "rgba(245,158,11,.12)", label: "Admin portal"    },
  };
  const rc = roleColors[form.role];

  return (
    <>
      <style>{`
        /* ── panel entrance ── */
        @keyframes lp-rise {
          from { opacity:0; transform:translateY(22px) scale(.98); }
          to   { opacity:1; transform:translateY(0)    scale(1);   }
        }
        .lp-card  { animation: lp-rise .6s cubic-bezier(.22,1,.36,1) both; }
        .lp-left  { animation: lp-rise .6s cubic-bezier(.22,1,.36,1) .08s both; }
        .lp-form  { animation: lp-rise .6s cubic-bezier(.22,1,.36,1) .16s both; }

        /* ── blob ── */
        @keyframes lp-float {
          0%,100%{ transform:translateY(0)   scale(1);    }
          50%    { transform:translateY(-16px) scale(1.04); }
        }
        .lp-blob {
          position:absolute; border-radius:50%;
          pointer-events:none; filter:blur(60px);
          animation:lp-float 10s ease-in-out infinite;
        }

        /* ── shimmer text ── */
        @keyframes lp-shimmer {
          0%  { background-position:0%   center; }
          100%{ background-position:200% center; }
        }
        .lp-gradient-text {
          background: linear-gradient(120deg,#fff 0%,#a5b4fc 50%,#34d399 100%);
          background-size:200% auto;
          -webkit-background-clip:text; -webkit-text-fill-color:transparent;
          background-clip:text;
          animation:lp-shimmer 5s linear infinite;
        }

        /* ── role accent transition ── */
        .lp-accent-bar {
          height:3px; border-radius:999px;
          transition: background .4s ease, width .4s ease;
        }

        /* ── submit button glow ── */
        .lp-submit {
          background: linear-gradient(135deg,#6366f1,#4f46e5) !important;
          border:none !important; color:#fff !important;
          box-shadow:0 4px 20px rgba(99,102,241,.40);
          transition: transform .2s ease, box-shadow .2s ease, filter .2s ease !important;
        }
        .lp-submit:hover:not(:disabled) {
          transform:translateY(-2px) !important;
          box-shadow:0 8px 28px rgba(99,102,241,.55) !important;
          filter:brightness(1.08);
        }
        .lp-submit:disabled { opacity:.55; }

        /* ── inline links ── */
        .lp-link {
          color:var(--indigo-light,#a5b4fc);
          font-weight:700;
          transition: color .2s ease;
          text-decoration:none;
        }
        .lp-link:hover { color:#fff; text-decoration:underline; }

        /* ── admin hint ── */
        .lp-admin-hint {
          border-radius:10px;
          border:1px solid rgba(245,158,11,.28);
          background:rgba(245,158,11,.07);
          padding:.85rem 1rem;
          font-size:.82rem;
          animation: lp-rise .35s ease both;
        }

        /* ── feature list ── */
        .lp-feature {
          display:flex; align-items:flex-start; gap:.75rem;
          padding:.7rem 0;
          border-bottom:1px solid rgba(255,255,255,.06);
        }
        .lp-feature:last-child { border-bottom:none; }
        .lp-feature-dot {
          width:7px; height:7px; border-radius:50%; flex-shrink:0; margin-top:.38rem;
        }
      `}</style>

      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl place-items-center px-4 py-10 sm:px-6">
        <div className="lp-card w-full max-w-5xl overflow-hidden rounded-2xl"
          style={{ border:"1px solid rgba(255,255,255,.08)", background:"rgba(255,255,255,.02)", backdropFilter:"blur(20px)", boxShadow:"0 32px 80px rgba(0,0,0,.50)" }}>

          <div className="grid md:grid-cols-[1fr_420px]">

            {/* ════ LEFT PANEL ════ */}
            <section className="lp-left relative hidden overflow-hidden p-10 text-white md:flex md:flex-col md:justify-between"
              style={{ background:"linear-gradient(145deg,#0d0d1e 0%,#0a0a16 100%)", borderRight:"1px solid rgba(255,255,255,.06)" }}>

              {/* blobs */}
              <div className="lp-blob" style={{ top:"-40px", right:"-20px", width:"300px", height:"300px", background:`${rc.dim}`, animationDelay:"0s"  }} />
              <div className="lp-blob" style={{ bottom:"-40px",left:"-20px",  width:"240px", height:"240px", background:"rgba(52,211,153,.06)",          animationDelay:"5s"  }} />

              <div className="relative z-10">
                {/* badge */}
                <div className="mb-8 inline-flex items-center gap-2 rounded-full px-3 py-1"
                  style={{ border:`1px solid ${rc.accent}44`, background:`${rc.dim}`, backdropFilter:"blur(6px)" }}>
                  <ShieldCheck size={13} style={{ color: rc.accent }} />
                  <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: rc.accent }}>
                    Secure access
                  </span>
                </div>

                <h1 className="text-3xl font-black leading-tight xl:text-4xl">
                  <span className="lp-gradient-text">One login</span>
                  <br />
                  <span className="text-white">for every Panchayat</span>
                  <br />
                  <span className="text-white">service.</span>
                </h1>

                {/* accent bar */}
                <div className="lp-accent-bar mt-5 w-16" style={{ background: rc.accent }} />

                <p className="mt-5 text-sm leading-7 text-neutral-400">
                  Citizens, workers, and admins use the same authentication system
                  with role-based routing and protected dashboards.
                </p>

                {/* feature list */}
                <div className="mt-8">
                  {[
                    { color:"#6366f1", text:"Role-based routing & dashboards"  },
                    { color:"#10b981", text:"Complaint, scheme & cert tracking" },
                    { color:"#f59e0b", text:"Secure Panchayat communication"   },
                  ].map((f) => (
                    <div key={f.text} className="lp-feature">
                      <span className="lp-feature-dot" style={{ background: f.color }} />
                      <span className="text-sm text-neutral-300">{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* bottom tag */}
              <p className="relative z-10 mt-8 text-xs text-neutral-600">
                Smart Panchayat · Digital local governance
              </p>
            </section>

            {/* ════ FORM PANEL ════ */}
            <form onSubmit={onSubmit} className="lp-form flex flex-col justify-center space-y-5 p-6 md:p-9"
              style={{ background:"rgba(255,255,255,.025)" }}>

              {/* header */}
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-widest text-neutral-500">
                  {rc.label}
                </p>
                <h2 className="text-2xl font-black text-white">Sign in</h2>
                <p className="mt-1.5 text-sm text-neutral-500">
                  Use your registered phone number and password.
                </p>
              </div>

              {/* role */}
              <Field label="Role">
                <Select name="role" value={form.role} onChange={update}>
                  <option value="citizen">Citizen</option>
                  <option value="worker">Worker</option>
                  <option value="admin">Admin</option>
                </Select>
              </Field>

              {/* phone */}
              <Field label="Phone number">
                <Input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={update}
                  inputMode="numeric"
                  maxLength="10"
                  placeholder="10-digit mobile number"
                  required
                />
              </Field>

              {/* password */}
              <Field label="Password">
                <Input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={update}
                  placeholder="••••••••"
                  required
                />
              </Field>

              {/* admin hint */}
              {form.role === "admin" ? (
                <div className="lp-admin-hint">
                  <p className="font-black text-amber-400">Default admin credentials</p>
                  <p className="mt-1.5 text-neutral-400">
                    Phone: <span className="font-bold text-amber-300">9999999999</span>
                  </p>
                  <p className="text-neutral-400">
                    Password: <span className="font-bold text-amber-300">Admin@12345</span>
                  </p>
                </div>
              ) : null}

              {/* submit */}
              <Button type="submit" icon={LogIn} disabled={submitting} className="lp-submit w-full">
                {submitting ? "Signing in…" : "Login"}
              </Button>

              {/* links */}
              <div className="grid gap-2 pt-1 text-sm">
                <span className="text-neutral-500">
                  New citizen?{" "}
                  <Link className="lp-link" to="/register">Create an account</Link>
                </span>
                <span className="text-neutral-500">
                  Want to work?{" "}
                  <Link className="lp-link" to="/worker-register">Apply as verified worker</Link>
                </span>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}