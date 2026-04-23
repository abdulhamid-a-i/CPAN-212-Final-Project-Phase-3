"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/guards/ProtectedRoute";
import StoreShell from "@/components/layout/StoreShell";
import SectionHeader from "@/components/layout/SectionHeader";
import { apiRequest } from "@/lib/api";
import type { User } from "@/types/user";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import Alert from "@/components/feedback/Alert";

function getRoleNames(roles: unknown[] | undefined): string[] {
  return (roles || []).map((role) => {
    if (typeof role === "string") {
      return role;
    }

    if (role && typeof role === "object" && "name" in role) {
      return String((role as { name?: string }).name || "");
    }

    return String(role);
  });
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const router = useRouter();
  const [showModal, setModal] = useState(false);
  const [showError, setError] = useState(false);
  const [Err, setText] = useState("");

  const roleNames = getRoleNames(user?.roles);

   const isAdmin = roleNames.includes("ADMIN");

   const cannotSeeSuspend = isAdmin;

  useEffect(() => {
    async function load() {
      const response = await apiRequest<User>("/profile/me",{
        useAuthHeader: true
      }
      );
      setProfile(response.data);
    }

    void load();
  }, []);

    async function suspendAccount(){
      try{
        const response = await apiRequest<User>("/profile/me", {
      method: "PATCH",
      useAuthHeader: true
    })

    setModal(false);
    logout();
    router.push("/login");

      } catch(error){
        const errString = error;
        console.log("Failed to suspend account")
        setModal(false);
        setError(true);
        setText((error as Error).message);
      }

  }

  return (
    <ProtectedRoute>
      {showModal ? (<ConfirmDialog title="Suspend Profile" description="Are you sure you want to suspend your profile?" onConfirm={suspendAccount} onCancel={() => setModal(false)}></ConfirmDialog>) : null}
      <StoreShell>
        <SectionHeader
          title="Profile"
          subtitle="Comprehensive user identity and business profile data."
        />
        <div style={{display: "flex", gap:"6px", marginBottom:"15px"}}>
          <button
        className="btn btn-secondary w-35 h-15 hover:bg-amber-950! transition duration-200"
        onClick={() => {router.push("/profile/edit"); }}>Edit</button><></>
        {!cannotSeeSuspend && (
          <button
          className="btn bg-(--danger) w-35 h-15 ml-2 hover:bg-red-950 transition duration-200"
          onClick={() => setModal(true)}>Suspend Acc</button>
        )}
        </div>
        
        {showError ? (
          <div>
            <Alert variant="error" message={Err}></Alert>
            <br></br>
          </div>) : null}
        {profile ? (
          
          <div className="profile-grid">
            <div className="panel">
              <h3>Identity</h3>
              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>Status:</strong> {profile.accountStatus}</p>
              <p><strong>Roles:</strong> {profile.roles.join(", ")}</p>
            </div>

            <div className="panel">
              <h3>Profile Details</h3>
              <p><strong>Name:</strong> {profile.profile.firstName} {profile.profile.lastName}</p>
              <p><strong>Email:</strong> {profile.profile.email}</p>
              <p><strong>Phone:</strong> {profile.profile.phone || "-"}</p>
              <p><strong>City:</strong> {profile.profile.city || "-"}</p>
              <p><strong>Country:</strong> {profile.profile.country || "-"}</p>
              <p><strong>User Type:</strong> {profile.profile.userType}</p>

            </div>
            
          </div>
        ) : null}
      </StoreShell>
    </ProtectedRoute>
  );
}