"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import RoleGuard from "@/components/guards/RoleGuard";
import PageShell from "@/components/layout/PageShell";
import SectionHeader from "@/components/layout/SectionHeader";
import DataTable, { type DataTableColumn } from "@/components/tables/DataTable";
import StatusBadge from "@/components/tables/StatusBadge";
import { apiRequest } from "@/lib/api";
import type { User } from "@/types/user";
import { useRouter } from "next/navigation";

export default function AdminAccountStatusPage() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const response = await apiRequest<User[]>("/admin/users");
      setUsers(response.data);
    }

    void load();
  }, []);



  const columns: DataTableColumn<User>[] = [
    { key: "username", label: "Username", render: (row) => row.username },
    { key: "fullName", label: "Full Name", render: (row) => `${row.profile.firstName} ${row.profile.lastName}` },
    { key: "roles", label: "Roles", render: (row) => row.roles.join(", ") },
    { key: "accountStatus", label: "Status", render: (row) => <StatusBadge value={row.accountStatus} /> },
{
  key: "accountStatus",
  label: "Status",
  render: (row) => {
    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newStatus = e.target.value;

      try {
        await apiRequest(`/admin/users/${row._id}/status`, {
          method: "PUT",
          body: {
            accountStatus: newStatus
          }
        });

        setUsers((prev) =>
          prev.map((u) =>
            u._id === row._id
              ? { ...u, accountStatus: newStatus }
              : u
          )
        );
      } catch (err) {
        console.error("Failed to update status", err);
        alert("Failed to update status");
      }
    };

    return (
      <select
        value={row.accountStatus}
        onChange={handleChange}
        className="border rounded-lg px-2 py-1"
      >
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
        <option value="SUSPENDED">Suspended</option>
      </select>
    );
  }
}
  ];

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["ADMIN"]}>
        <PageShell>
          <SectionHeader title="Account Status" subtitle="Centralized user account status administration." />
          <DataTable columns={columns} data={users} rowKey={(row) => row._id} />
        </PageShell>
      </RoleGuard>
    </ProtectedRoute>
  );
}