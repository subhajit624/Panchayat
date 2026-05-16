import { ArrowRight, Bell, ClipboardList, FileCheck, MessageSquare, Search, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.png";
import { Button } from "../../components/Button";

const modules = [
  { icon: ClipboardList, title: "Complaint tracking", text: "Raise ward complaints with photos and follow every status update." },
  { icon: Wrench, title: "Verified workers", text: "Find approved local workers by category, rating, and availability." },
  { icon: FileCheck, title: "Schemes and certificates", text: "Apply online, upload documents, and track decisions." },
  { icon: MessageSquare, title: "Direct communication", text: "Chat with admins or assigned workers from one secure account." },
];

export default function Home() {
  return (
    <>
      <section
        className="relative min-h-[78vh] overflow-hidden bg-black text-white"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.86), rgba(0,0,0,.62), rgba(0,0,0,.26)), url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto flex min-h-[78vh] max-w-7xl items-center px-4 py-16">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-300">Digital local governance</p>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">Smart Panchayat</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-200">
              A single civic workspace for complaints, notices, verified workers, schemes, certificates, and secure Panchayat communication.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register">
                <Button icon={ArrowRight} className="w-full bg-white text-black hover:bg-neutral-200 sm:w-auto">
                  Citizen Registration
                </Button>
              </Link>
              <Link to="/worker-register">
                <Button variant="secondary" className="w-full border-white bg-transparent text-white hover:bg-white hover:text-black sm:w-auto">
                  Register as Worker
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-4">
        {modules.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title} className="surface p-5">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg border border-neutral-200 bg-neutral-50">
                <Icon size={20} />
              </div>
              <h2 className="text-lg font-black">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{item.text}</p>
            </article>
          );
        })}
      </section>

      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3">
          {[
            { icon: Bell, label: "Latest notices", to: "/notices" },
            { icon: Search, label: "Worker directory", to: "/workers" },
            { icon: ClipboardList, label: "Track services", to: "/login" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} to={item.to} className="group flex items-center justify-between rounded-lg border border-neutral-200 p-5 transition hover:border-black">
                <span className="flex items-center gap-3 text-lg font-black">
                  <Icon size={20} />
                  {item.label}
                </span>
                <ArrowRight className="transition group-hover:translate-x-1" size={18} />
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
