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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  async function load() {
    const response = await apiRequest<User[]>("/admin/users");
    setUsers(response.data);
  }
  useEffect(() => {


    void load();
  }, []);

  async function handleDelete(id: string){
    await apiRequest(`/admin/users/${id}`, { method: "DELETE" });
  await load();
  }

  const columns: DataTableColumn<User>[] = [
    { key: "username", label: "Username", render: (row) => row.username },
    { key: "fullName", label: "Full Name", render: (row) => `${row.profile.firstName} ${row.profile.lastName}` },
    { key: "roles", label: "Roles", render: (row) => row.roles.join(", ") },
    { key: "accountStatus", label: "Status", render: (row) => <StatusBadge value={row.accountStatus} /> },
    { key: "actions", label: "Actions", render: (row) => (<>
            <button
              className="btn btn-secondary w-25 hover:bg-amber-950! transition duration-200"
              onClick={() => {router.push(`users/${row._id}`); }}>View</button>
            <button
              className="btn btn-secondary w-25 ml-2 hover:bg-amber-950! transition duration-200"
              onClick={() => {router.push(`users/${row._id}/edit`); }}>Edit</button>
            <button
              className="btn bg-(--danger) w-25 ml-2 hover:bg-red-950 transition duration-200"
              onClick={() => handleDelete(row._id)}>Delete</button>
    </>)}
  ];

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["ADMIN"]}>
        <PageShell>
          <SectionHeader title="Admin Users" subtitle="Centralized user account administration." />
          <button
          className="btn btn-secondary hover:bg-amber-950! transition"
          onClick={() => {router.push("users/create"); }}>Create New User</button> <></><></>
          <button
          className="btn btn-secondary hover:bg-amber-950! transition"
          onClick={() => {router.push("/admin/rbac"); }}>Manage Roles</button> <></>
          <button
          className="btn btn-secondary hover:bg-amber-950! transition"
          onClick={() => {router.push("/admin/account-status"); }}>Manage Status</button>
          <br></br>
          <br></br>
          <DataTable columns={columns} data={users} rowKey={(row) => row._id} />
        </PageShell>
      </RoleGuard>
    </ProtectedRoute>
  );
}