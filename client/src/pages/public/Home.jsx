import { ArrowRight, Bell, ClipboardList, FileCheck, MessageSquare, Search, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.png";
import { Button } from "../../components/Button";

const modules = [
  { icon: ClipboardList, title: "Complaint tracking",       text: "Raise ward complaints with photos and follow every status update.", accent: "indigo"  },
  { icon: Wrench,        title: "Verified workers",         text: "Find approved local workers by category, rating, and availability.", accent: "emerald" },
  { icon: FileCheck,     title: "Schemes and certificates", text: "Apply online, upload documents, and track decisions.",               accent: "indigo"  },
  { icon: MessageSquare, title: "Direct communication",     text: "Chat with admins or assigned workers from one secure account.",      accent: "emerald" },
];

export default function Home() {
  return (
    <>
      <style>{`
        /* ── shimmer headline ── */
        @keyframes gc-shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        .gc-gradient-text {
          background: linear-gradient(120deg, #fff 0%, #a5b4fc 45%, #34d399 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gc-shimmer 5s linear infinite;
        }

        /* ── ambient blobs ── */
        @keyframes gc-float {
          0%, 100% { transform: translateY(0)    scale(1);    }
          50%       { transform: translateY(-20px) scale(1.04); }
        }
        .gc-blob {
          position: absolute; border-radius: 50%;
          pointer-events: none; filter: blur(70px);
          animation: gc-float 9s ease-in-out infinite;
        }

        /* ── badge dot ── */
        @keyframes gc-dot { 0%,100%{opacity:1;} 50%{opacity:.3;} }
        .gc-dot { animation: gc-dot 2.2s ease-in-out infinite; }

        /* ── hero entrance ── */
        @keyframes gc-rise {
          from { opacity:0; transform:translateY(26px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .gc-rise { animation: gc-rise .75s cubic-bezier(.22,1,.36,1) both; }
        .gc-d1 { animation-delay:.06s; }
        .gc-d2 { animation-delay:.20s; }
        .gc-d3 { animation-delay:.34s; }
        .gc-d4 { animation-delay:.48s; }
        .gc-d5 { animation-delay:.62s; }

        /* ── hero CTA buttons ── */
        .gc-cta-primary {
          background: linear-gradient(135deg,#6366f1 0%,#4f46e5 100%) !important;
          border: none !important; color:#fff !important;
          box-shadow: 0 4px 22px rgba(99,102,241,.42);
          transition: transform .2s ease, box-shadow .2s ease, filter .2s ease !important;
        }
        .gc-cta-primary:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 32px rgba(99,102,241,.55) !important;
          filter: brightness(1.08);
        }
        .gc-cta-secondary {
          border: 1px solid rgba(255,255,255,.22) !important;
          background: rgba(255,255,255,.06) !important;
          color: #fff !important;
          backdrop-filter: blur(8px);
          transition: background .2s ease, border-color .2s ease, transform .2s ease !important;
        }
        .gc-cta-secondary:hover {
          background: rgba(255,255,255,.12) !important;
          border-color: rgba(255,255,255,.38) !important;
          transform: translateY(-2px) !important;
        }

        /* ── module cards (extend .surface) ── */
        .gc-module {
          transition: transform .28s ease, box-shadow .28s ease, border-color .28s ease;
        }
        .gc-module:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 52px rgba(99,102,241,.14);
          border-color: rgba(99,102,241,.38) !important;
        }
        .gc-module.em:hover {
          box-shadow: 0 24px 52px rgba(16,185,129,.12);
          border-color: rgba(16,185,129,.32) !important;
        }

        /* ── icon wrap ── */
        .gc-icon { display:grid; place-items:center; width:46px; height:46px; border-radius:12px; margin-bottom:1.1rem; }
        .gc-icon-i { background:linear-gradient(135deg,rgba(99,102,241,.18),rgba(79,70,229,.06)); border:1px solid rgba(99,102,241,.26); box-shadow:0 0 18px rgba(99,102,241,.14); }
        .gc-icon-e { background:linear-gradient(135deg,rgba(16,185,129,.18),rgba(5,150,105,.06)); border:1px solid rgba(16,185,129,.26); box-shadow:0 0 18px rgba(16,185,129,.12); }

        /* ── quick links ── */
        .gc-ql {
          border: 1px solid rgba(255,255,255,.07);
          background: rgba(255,255,255,.02);
          transition: background .25s ease, border-color .25s ease, transform .25s ease, box-shadow .25s ease;
        }
        .gc-ql:hover {
          background: rgba(99,102,241,.07) !important;
          border-color: rgba(99,102,241,.32) !important;
          transform: translateX(5px);
          box-shadow: 0 6px 28px rgba(99,102,241,.12);
        }
        .gc-ql-arrow { transition: transform .25s ease, color .25s ease; color:rgba(255,255,255,.22); }
        .gc-ql:hover .gc-ql-arrow { transform:translateX(5px); color:#818cf8; }

        /* ── stat separator ── */
        .gc-sep { width:1px; height:28px; background:rgba(255,255,255,.10); flex-shrink:0; }

        /* ── section label ── */
        .gc-label { font-size:.7rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; margin-bottom:.35rem; display:block; }
      `}</style>

      {/* ══════════════════ HERO ══════════════════ */}
      <section
        className="relative min-h-[88vh] overflow-hidden text-white"
        style={{
          backgroundImage:`linear-gradient(135deg,rgba(4,4,10,.97) 0%,rgba(8,8,15,.89) 55%,rgba(0,0,0,.70) 100%),url(${heroImage})`,
          backgroundSize:"cover", backgroundPosition:"center", backgroundColor:"#08080f",
        }}
      >
        {/* blobs */}
        <div className="gc-blob" style={{ top:"-60px",  right:"6%",  width:"520px", height:"520px", background:"rgba(99,102,241,.11)", animationDelay:"0s" }} />
        <div className="gc-blob" style={{ bottom:"-20px",left:"-5%", width:"380px", height:"380px", background:"rgba(52,211,153,.08)",  animationDelay:"4s" }} />

        {/* grid overlay */}
        <div className="animated-grid pointer-events-none absolute inset-0 opacity-50" />

        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">

            {/* badge */}
            <div className="gc-rise gc-d1 mb-6 inline-flex items-center gap-2.5 rounded-full px-4 py-1.5"
              style={{ border:"1px solid rgba(99,102,241,.28)", background:"rgba(99,102,241,.10)", backdropFilter:"blur(8px)" }}>
              <span className="gc-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-widest text-indigo-300">Digital local governance</span>
            </div>

            {/* headline */}
            <h1 className="gc-rise gc-d2 text-5xl font-black leading-none tracking-tight sm:text-6xl lg:text-[80px]">
              <span className="gc-gradient-text">Smart</span><br />
              <span className="gc-gradient-text">Panchayat</span>
            </h1>

            {/* subtext */}
            <p className="gc-rise gc-d3 mt-6 max-w-xl text-base leading-8 text-neutral-400 sm:text-lg">
              A single civic workspace for complaints, notices, verified workers,
              schemes, certificates, and secure Panchayat communication.
            </p>

            {/* CTAs */}
            <div className="gc-rise gc-d4 mt-10 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="w-full sm:w-auto">
                <Button icon={ArrowRight} className="gc-cta-primary w-full sm:w-auto">Citizen Registration</Button>
              </Link>
              <Link to="/worker-register" className="w-full sm:w-auto">
                <Button variant="secondary" className="gc-cta-secondary w-full sm:w-auto">Register as Worker</Button>
              </Link>
            </div>

            {/* stats */}
            <div className="gc-rise gc-d5 mt-12 flex flex-wrap items-center gap-6 sm:gap-8">
              {[
                { val:"2400+", label:"Active citizens"       },
                { val:"180+", label:"Complaints resolved"   },
                { val:"22+",   label:"Verified workers"      },
              ].map((s, i) => (
                <div key={s.val} className="flex items-center gap-4">
                  {i > 0 && <div className="gc-sep hidden sm:block" />}
                  <div>
                    <p className="text-xl font-black text-white sm:text-2xl">{s.val}</p>
                    <p className="text-xs text-neutral-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ MODULES ══════════════════ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-rise mb-10 text-center">
          <span className="gc-label text-indigo-400">What we offer</span>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Everything in <span className="gc-gradient-text">one place</span>
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((item, i) => {
            const Icon = item.icon;
            const isIndigo = item.accent === "indigo";
            return (
              <article
                key={item.title}
                className={`surface gc-module shine animate-rise p-6 ${!isIndigo ? "em" : ""}`}
                style={{ animationDelay:`${.06 + i * .10}s` }}
              >
                <div className={`gc-icon ${isIndigo ? "gc-icon-i" : "gc-icon-e"}`}>
                  <Icon size={21} className={isIndigo ? "text-indigo-400" : "text-emerald-400"} />
                </div>
                <h3 className="text-[15px] font-black text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-500">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ══════════════════ QUICK LINKS ══════════════════ */}
      <section style={{ borderTop:"1px solid rgba(255,255,255,.05)", background:"rgba(255,255,255,.015)" }}>
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="animate-rise mb-8 text-center">
            <span className="gc-label text-emerald-400">Quick access</span>
            <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Jump right in</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: Bell,          label:"Latest notices",  to:"/notices" },
              { icon: Search,        label:"Worker directory", to:"/workers" },
              { icon: ClipboardList, label:"Track services",   to:"/login"   },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className="gc-ql animate-rise flex items-center justify-between rounded-xl p-5"
                  style={{ animationDelay:`${.06 + i * .12}s` }}
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl"
                      style={{ background:"rgba(99,102,241,.10)", border:"1px solid rgba(99,102,241,.20)" }}>
                      <Icon size={18} className="text-indigo-400" />
                    </span>
                    <span className="text-sm font-bold text-white sm:text-base">{item.label}</span>
                  </span>
                  <ArrowRight className="gc-ql-arrow" size={18} />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}