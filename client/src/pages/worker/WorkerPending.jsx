import { Clock, LogOut } from "lucide-react";
import { Button } from "../../components/Button";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";

export default function WorkerPending() {
  const { user, logout } = useAuth();

  return (
    <main className="grid min-h-screen place-items-center bg-neutral-50 px-4">
      <section className="surface max-w-xl p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg bg-black text-white">
          <Clock size={24} />
        </div>
        <h1 className="mt-5 text-3xl font-black">Worker approval pending</h1>
        <p className="mt-3 leading-7 text-neutral-600">
          Your worker profile is currently <StatusBadge value={user.workerApprovalStatus} />. You can access the worker dashboard after admin approval.
        </p>
        {user.rejectionReason ? <p className="mt-4 rounded-lg bg-neutral-100 p-3 text-sm text-neutral-700">{user.rejectionReason}</p> : null}
        <Button className="mt-6" variant="secondary" icon={LogOut} onClick={logout}>Logout</Button>
      </section>
    </main>
  );
}
