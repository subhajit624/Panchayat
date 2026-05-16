import {
  Ban,
  ShieldCheck,
  Search,
  Users,
} from "lucide-react";
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
  const [filters, setFilters] = useState({
    search: "",
    role: "",
    page: 1,
  });

  const load = async () => {
    setLoading(true);
    const { data: result } = await api.get("/users", {
      params: filters,
    });
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [filters]);

  const toggleBlock = async (user) => {
    try {
      await api.patch(`/users/${user._id}/block`, {
        isBlocked: !user.isBlocked,
      });

      toast.success(
        user.isBlocked
          ? "User unblocked."
          : "User blocked."
      );

      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <style>{`
        @keyframes mu-rise {
          from {
            opacity: 0;
            transform: translateY(20px) scale(.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes mu-float {
          0%,100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .mu-card {
          animation: mu-rise .6s cubic-bezier(.22,1,.36,1) both;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.10);
          backdrop-filter: blur(16px);
          box-shadow: 0 18px 45px rgba(0,0,0,.22);
        }

        .mu-avatar {
          animation: mu-float 3s ease-in-out infinite;
        }

        .mu-row:hover {
          background: rgba(99,102,241,.06);
        }
      `}</style>

      <PageHeader
        title="Manage Users"
        description="Search citizens and workers, review account status, and block or unblock access."
      />

      {/* Filters */}
      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_240px]">
        <div className="mu-card rounded-3xl p-5">
          <Field label="Search">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
              />

              <Input
                className="pl-12"
                value={filters.search}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    search: e.target.value,
                    page: 1,
                  })
                }
              />
            </div>
          </Field>
        </div>

        <div
          className="mu-card rounded-3xl p-5"
          style={{ animationDelay: "100ms" }}
        >
          <Field label="Role">
            <Select
              value={filters.role}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  role: e.target.value,
                  page: 1,
                })
              }
            >
              <option value="">All</option>
              <option value="citizen">Citizen</option>
              <option value="worker">Worker</option>
              <option value="admin">Admin</option>
            </Select>
          </Field>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <Loader />
      ) : data.items.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <div className="mu-card overflow-hidden rounded-3xl">
          {/* Header */}
          <div className="flex items-center gap-4 border-b border-white/10 p-6">
            <div
              className="
                mu-avatar
                grid
                h-14
                w-14
                place-items-center
                rounded-2xl
                border
                border-indigo-400/20
                bg-gradient-to-br
                from-indigo-500/20
                to-violet-500/10
                text-indigo-300
              "
            >
              <Users size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">
                User Directory
              </h2>

              <p className="mt-1 text-sm text-neutral-400">
                Access moderation & account control
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto app-scrollbar">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-neutral-400">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Ward</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {data.items.map((item) => (
                  <tr
                    key={item._id}
                    className="
                      mu-row
                      border-t
                      border-white/6
                      transition-all
                      duration-300
                    "
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="
                            grid
                            h-11
                            w-11
                            place-items-center
                            rounded-2xl
                            border
                            border-indigo-400/20
                            bg-gradient-to-br
                            from-indigo-500/20
                            to-violet-500/10
                            text-sm
                            font-black
                            text-indigo-300
                          "
                        >
                          {item.name?.slice(0, 2).toUpperCase()}
                        </div>

                        <span className="font-black text-white">
                          {item.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-neutral-300">
                      {item.phoneNumber}
                    </td>

                    <td className="px-6 py-5 font-semibold text-neutral-300">
                      {titleCase(item.role)}
                    </td>

                    <td className="px-6 py-5 text-neutral-300">
                      {item.wardNumber || "-"}
                    </td>

                    <td className="px-6 py-5">
                      <StatusBadge
                        value={
                          item.isBlocked
                            ? "blocked"
                            : item.workerApprovalStatus
                        }
                      />
                    </td>

                    <td className="px-6 py-5">
                      {item.role !== "admin" ? (
                        <Button
                          variant={
                            item.isBlocked
                              ? "primary"
                              : "danger"
                          }
                          icon={
                            item.isBlocked
                              ? ShieldCheck
                              : Ban
                          }
                          onClick={() => toggleBlock(item)}
                        >
                          {item.isBlocked
                            ? "Unblock"
                            : "Block"}
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination
        pagination={data.pagination}
        onPage={(page) =>
          setFilters({
            ...filters,
            page,
          })
        }
      />
    </>
  );
}