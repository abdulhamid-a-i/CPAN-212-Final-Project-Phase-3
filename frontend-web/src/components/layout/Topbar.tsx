"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function Topbar() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();

    // Only redirect for LOCAL logout
    // For KEYCLOAK logout, backend will handle redirect
    const authMode = localStorage.getItem("authMode");

    if (authMode !== "KEYCLOAK") {
      router.push("/login");
    }
  };

  return (
    <header className="topbar">
      <div>
        <h2>Secure Operations Workspace</h2>
      </div>

      <button className="btn btn-secondary w-20 flex items-center justify-center hover:bg-amber-600! transition duration-150" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
}