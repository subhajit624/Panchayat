import { Ban, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/Button";
import { Field, Input, Select } from "../../components/FormField";
import { Loader, EmptyState } from "../../components/Loader";
import { PageHeader } from "../../components/PageHeader";
import { Pagination } from "../../components/Pagination";
import { StatusBadge } from "../../components/StatusBadge";
import { api, getErrorMessage } from "../../services/api";
import { titleCase } from "../../utils/constants";

export default function ManageUsers() {
  const [data, setData] = useState({ items: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", role: "", page: 1 });

  const load = async () => {
    setLoading(true);
    const { data: result } = await api.get("/users", { params: filters });
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filters]);

  const toggleBlock = async (user) => {
    try {
      await api.patch(`/users/${user._id}/block`, { isBlocked: !user.isBlocked });
      toast.success(user.isBlocked ? "User unblocked." : "User blocked.");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <PageHeader title="Manage Users" description="Search citizens and workers, review account status, and block or unblock access." />
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_220px]">
        <Field label="Search"><Input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })} /></Field>
        <Field label="Role">
          <Select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}>
            <option value="">All</option>
            <option value="citizen">Citizen</option>
            <option value="worker">Worker</option>
            <option value="admin">Admin</option>
          </Select>
        </Field>
      </div>
      {loading ? <Loader /> : data.items.length === 0 ? <EmptyState title="No users found" /> : (
        <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white app-scrollbar">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="bg-neutral-50 text-xs uppercase tracking-widest text-neutral-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Ward</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item._id} className="border-t border-neutral-100">
                  <td className="px-4 py-3 font-bold">{item.name}</td>
                  <td className="px-4 py-3">{item.phoneNumber}</td>
                  <td className="px-4 py-3">{titleCase(item.role)}</td>
                  <td className="px-4 py-3">{item.wardNumber || "-"}</td>
                  <td className="px-4 py-3"><StatusBadge value={item.isBlocked ? "blocked" : item.workerApprovalStatus} /></td>
                  <td className="px-4 py-3">
                    {item.role !== "admin" ? (
                      <Button variant="secondary" icon={item.isBlocked ? ShieldCheck : Ban} onClick={() => toggleBlock(item)}>
                        {item.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination pagination={data.pagination} onPage={(page) => setFilters({ ...filters, page })} />
    </>
  );
}
