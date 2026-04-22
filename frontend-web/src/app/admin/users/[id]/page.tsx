"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import ProtectedRoute from "@/components/guards/ProtectedRoute";
import PageShell from "@/components/layout/PageShell";
import SectionHeader from "@/components/layout/SectionHeader";
import { apiRequest } from "@/lib/api";
import type { User } from "@/types/user";

import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import Alert from "@/components/feedback/Alert";
import RoleGuard from "@/components/guards/RoleGuard";

function getRoleNames(roles: unknown[] | undefined): string[] {
  return (roles || []).map((role) => {
    if (typeof role === "string") return role;

    if (role && typeof role === "object" && "name" in role) {
      return String((role as { name?: string }).name || "");
    }

    return String(role);
  });
}

export default function AdminUserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [profile, setProfile] = useState<User | null>(null);
  const [showModal, setModal] = useState(false);
  const [showError, setError] = useState(false);
  const [errText, setErrText] = useState("");

  useEffect(() => {
    async function load() {
      const response = await apiRequest<User>(`/admin/users/${id}`);
      setProfile(response.data);
    }

    if (id) void load();
  }, [id]);

  const roleNames = getRoleNames(profile?.roles);
  const isAdmin = roleNames.includes("ADMIN");
  const cannotSeeSuspend = isAdmin;

  async function suspendAccount() {
    try {
      await apiRequest<User>(`/users/${id}/suspend`, {
        method: "PATCH"
      });

      setModal(false);
      router.push("/admin/users");
    } catch (error) {
      setModal(false);
      setError(true);
      setErrText((error as Error).message);
    }
  }

  return (
    <ProtectedRoute>
      {showModal ? (
        <ConfirmDialog
          title="Suspend Profile"
          description="Are you sure you want to suspend this user?"
          onConfirm={suspendAccount}
          onCancel={() => setModal(false)}
        />
      ) : null}
      <RoleGuard allowedRoles={["ADMIN"]}>
      <PageShell>
        <SectionHeader
          title="User Profile (Admin View)"
          subtitle="View and manage user account details."
        />

        <div style={{ display: "flex", gap: "6px", marginBottom: "15px" }}>
          <button
            className="btn btn-secondary ml-2 hover:bg-amber-950! transition duration-200"
            style={{ width: "130px" }}
            onClick={() => router.push(`/admin/users/${id}/edit`)}
          >
            Edit
          </button>

          {!cannotSeeSuspend && (
            <button
              className="btn bg-(--danger) ml-2 hover:bg-red-950 transition duration-200"
              style={{ width: "130px" }}
              onClick={() => setModal(true)}
            >
              Suspend
            </button>
          )}
        </div>

        {showError && (
          <Alert variant="error" message={errText} />
        )}

        {profile && (
          <div className="profile-grid">
            <div className="panel">
              <h3>Identity</h3>
              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>Status:</strong> {profile.accountStatus}</p>
              <p><strong>Roles:</strong> {profile.roles.join(", ")}</p>
            </div>

            <div className="panel">
              <h3>Profile Details</h3>
              <p>
                <strong>Name:</strong>{" "}
                {profile.profile.firstName} {profile.profile.lastName}
              </p>
              <p><strong>Email:</strong> {profile.profile.email}</p>
              <p><strong>Phone:</strong> {profile.profile.phone || "-"}</p>
              <p><strong>City:</strong> {profile.profile.city || "-"}</p>
              <p><strong>Country:</strong> {profile.profile.country || "-"}</p>
              <p><strong>User Type:</strong> {profile.profile.userType}</p>
            </div>
          </div>
        )}
      </PageShell>
      </RoleGuard>
    </ProtectedRoute>
  );
}