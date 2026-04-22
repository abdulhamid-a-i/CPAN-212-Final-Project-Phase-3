"use client";

import ProtectedRoute from "@/components/guards/ProtectedRoute";
import RoleGuard from "@/components/guards/RoleGuard";
import PageShell from "@/components/layout/PageShell";
import SectionHeader from "@/components/layout/SectionHeader";
import UserForm from "@/components/forms/UserForm";
import { User } from "@/types/user";
import { useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
    
  useEffect(() => {
    if (!id) return;

    async function loadUser() {
      try {
        const response = await api.get<User>(`/admin/users/${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Failed to load user", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    void loadUser();
  }, [id]);

 const formData = useMemo(() => {
    if (!data) return null;

    

    return {
      username: data.username || "",

      fullName: data.profile
        ? `${data.profile.firstName} ${data.profile.lastName}`
        : "",

      email: data.profile?.email || "",

      password: "",

      roles: data.roles || [],

      status: data.accountStatus || "ACTIVE",

      phone: data.profile.phone || "",

      city: data.profile.city || "",

      country: data.profile.country || "",

      userType: data.profile.userType || ""

    };
  }, [data]);


  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={["ADMIN"]}>
        <PageShell>
          <SectionHeader
            title="Edit User"
            subtitle="Edit a user account and assign roles within the insurance platform."
          />

          <div className="max-w-3xl">
           {formData && (
              <UserForm
                initialData={formData}
                isEdit
                userId={id}
              />
            )}
          </div>
        </PageShell>
      </RoleGuard>
    </ProtectedRoute>
  );
}