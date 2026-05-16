import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import { Textarea } from "../../components/FormField";
import { Loader, EmptyState } from "../../components/Loader";
import { Modal } from "../../components/Modal";
import { PageHeader } from "../../components/PageHeader";
import { StatusBadge } from "../../components/StatusBadge";
import { api, getErrorMessage } from "../../services/api";
import { titleCase } from "../../utils/constants";

export default function WorkerApprovals() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");

  const load = async () => {
    setLoading(true);
    const { data } = await api.get("/users/workers/pending");
    setWorkers(data.items);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (worker) => {
    try {
      await api.patch(`/users/workers/${worker._id}/approve`);
      toast.success("Worker approved.");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const reject = async () => {
    try {
      await api.patch(`/users/workers/${rejecting._id}/reject`, { rejectionReason: reason });
      toast.success("Worker rejected.");
      setRejecting(null);
      setReason("");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <PageHeader title="Worker Approval" description="Approve verified local service providers or reject applications with a clear reason." />
      {loading ? <Loader /> : workers.length === 0 ? <EmptyState title="No pending worker applications" /> : (
        <div className="grid gap-4 md:grid-cols-2">
          {workers.map((worker) => (
            <article key={worker._id} className="surface p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black">{worker.name}</h2>
                  <p className="text-sm text-neutral-500">{worker.phoneNumber} - Ward {worker.wardNumber}</p>
                </div>
                <StatusBadge value={worker.workerApprovalStatus} />
              </div>
              <div className="mt-4 rounded-lg bg-neutral-50 p-3 text-sm">
                <p><span className="font-bold">Category:</span> {titleCase(worker.workerDetails?.category)}</p>
                <p><span className="font-bold">Experience:</span> {worker.workerDetails?.experienceYears || 0} years</p>
                <p><span className="font-bold">Skills:</span> {(worker.workerDetails?.skills || []).join(", ") || "Not listed"}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <Button icon={Check} onClick={() => approve(worker)}>Approve</Button>
                <Button variant="secondary" icon={X} onClick={() => setRejecting(worker)}>Reject</Button>
              </div>
            </article>
          ))}
        </div>
      )}
      <Modal open={Boolean(rejecting)} title="Reject worker" onClose={() => setRejecting(null)} footer={<Button variant="danger" onClick={reject}>Reject application</Button>}>
        <Textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for rejection" />
      </Modal>
    </>
  );
}
