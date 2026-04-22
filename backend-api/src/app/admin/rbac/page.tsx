"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import RoleGuard from "@/components/guards/RoleGuard";
import PageShell from "@/components/layout/PageShell";
import SectionHeader from "@/components/layout/SectionHeader";
import RoleAssignmentForm from "@/components/forms/RoleAssignmentForm";
import { apiRequest } from "@/lib/api";
import type { User } from "@/types/user";
import type { Role } from "@/types/role";
import Alert from "@/components/feedback/Alert";

export default function AdminRbacPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [showError, setError] = useState(false);
  const [showSuccess, setSuccess] = useState(false);
  const [Err, setText] = useState("");
  const [msg, setMsg] = useState("");
  const [type,setType] = useState("");

  useEffect(() => {
    async function load() {
      const [usersResponse, rolesResponse] = await Promise.all([
        apiRequest<User[]>("/admin/users"),
        apiRequest<Role[]>("/admin/rbac/roles")
      ]);

      setUsers(usersResponse.data);
      setRoles(rolesResponse.data);

      if (usersResponse.data.length > 0) {
        setSelectedUserId(usersResponse.data[0]._id);
      }
    }

    void load();
  }, []);

  const selectedUser = users.find((user) => user._id === selectedUserId);

  async function handleRoleUpdate(nextRoles: string[]) {
    setSuccess(false);
    if (!selectedUserId) return;
    try{
      const response = await apiRequest(`/admin/rbac/users/${selectedUserId}/roles`, {
      method: "PUT",
      body: { roles: nextRoles }
    });
    setSuccess(true);
    setMsg(response.message);
    setError(false);
    const refreshedUsers = await apiRequest<User[]>("/admin/users");
    setUsers(refreshedUsers.data);
    } catch(error){
        const errString = error;
        console.log("Failed to suspend account")
        setError(true);
        setSuccess(false);
        setText((error as Error).message);
      }
  }

  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["ADMIN"]}>
        <PageShell>
          <SectionHeader title="RBAC Management" subtitle="Assign and manage user roles centrally." />
          {showError ? (
                    <div>
                      <Alert variant="error" message={Err}></Alert>
                      <br></br>
                    </div>) : null}
          {showSuccess ? (
                    <div>
                      <Alert variant="success" message={msg}></Alert>
                      <br></br>
                    </div>) : null}
          <div className="panel">
            <label>Select User</label>
            <select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          {selectedUser ? (
            <RoleAssignmentForm
              availableRoles={roles.map((role) => role.name)}
              currentRoles={selectedUser.roles}
              onSubmit={handleRoleUpdate}
            />
          ) : null}
        </PageShell>
      </RoleGuard>
    </ProtectedRoute>
  );
}